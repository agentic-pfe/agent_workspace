/* ============================================================
   Orcheeos Dashboard — app.js
   SSE parsing, localStorage history, health checks, dark UI
   ============================================================ */

(function () {
  'use strict';

  /* ===================== CONFIGURATION ===================== */
  const API_BASE = 'http://localhost:8000';
  const HEALTH_URL = API_BASE + '/api/v1/health';
  const RUN_URL = API_BASE + '/api/v1/run';
  const HEALTH_INTERVAL_MS = 30000;
  const HISTORY_KEY = 'orcheeos_history';
  const USER_KEY = 'orcheeos_user';
  const MAX_HISTORY = 50;

  /* ===================== DOM CACHE ===================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    loginOverlay: $('#login-overlay'),
    loginForm: $('#login-form'),
    loginUsername: $('#login-username'),

    offlineBanner: $('#offline-banner'),
    healthDot: $('#health-dot'),

    app: $('#app'),
    userDisplay: $('#user-display'),
    btnLogout: $('#btn-logout'),

    sidebar: $('#sidebar'),
    btnNewChat: $('#btn-new-chat'),
    historyList: $('#history-list'),
    historyEmpty: $('#history-empty'),

    chatPanel: $('#chat-panel'),
    chatWelcome: $('#chat-welcome'),

    actionBar: $('#action-bar'),
    btnPreview: $('#btn-preview'),
    btnDownload: $('#btn-download'),

    taskInput: $('#task-input'),
    levelSelect: $('#level'),
    specialtySelect: $('#specialty'),
    btnRun: $('#btn-run'),
    btnRunText: $('#btn-run .btn-run-text'),
    btnRunSpinner: $('#btn-run .btn-run-spinner'),
  };

  /* ===================== STATE ===================== */
  let currentUser = null;
  let currentTaskId = null;
  let currentEvents = [];
  let isRunning = false;
  let previewUrl = null;
  let downloadUrl = null;
  let serverOnline = null;       // null = unknown, true = online, false = offline
  let healthTimer = null;
  let historyData = [];

  /* ===================== UTILITY ===================== */
  function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /** Pretty-print any value for monospace display */
  function prettyMessage(val) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    try {
      return JSON.stringify(val, null, 2);
    } catch (e) {
      return String(val);
    }
  }

  /** Map event type → badge CSS class */
  function badgeClass(type) {
    const map = {
      planner: 'badge-planner',
      worker: 'badge-worker',
      error: 'badge-error',
      llm_call: 'badge-llm-call',
      tool_call: 'badge-tool-call',
      report: 'badge-report',
      task_complete: 'badge-complete',
      run_finished: 'badge-complete',
    };
    return map[type] || 'badge-default';
  }

  /** Human-readable label for event type */
  function badgeLabel(type) {
    const map = {
      planner: 'Planner',
      worker: 'Worker',
      error: 'Error',
      llm_call: 'LLM Call',
      tool_call: 'Tool Call',
      report: 'Report',
      task_complete: 'Complete',
      run_finished: 'Finished',
    };
    return map[type] || (type || 'Event');
  }

  /* ===================== LOGIN ===================== */
  function checkLogin() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      currentUser = stored.trim();
      if (currentUser) {
        dom.loginOverlay.hidden = true;
        dom.app.style.display = '';
        dom.userDisplay.textContent = currentUser;
        return true;
      }
    }
    // No valid user → show login
    dom.app.style.display = 'none';
    dom.loginOverlay.hidden = false;
    dom.loginUsername.focus();
    return false;
  }

  function handleLogin(username) {
    const name = username.trim();
    if (!name) return;
    currentUser = name;
    localStorage.setItem(USER_KEY, name);
    dom.loginOverlay.hidden = true;
    dom.app.style.display = '';
    dom.userDisplay.textContent = name;
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem(USER_KEY);
    dom.app.style.display = 'none';
    dom.loginOverlay.hidden = false;
    dom.loginUsername.value = '';
    dom.loginUsername.focus();
    clearChat();
  }

  /* ===================== HEALTH CHECK ===================== */
  async function checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(HEALTH_URL, {
        signal: controller.signal,
        cache: 'no-cache',
      });
      clearTimeout(timeoutId);
      return resp.ok;
    } catch (e) {
      return false;
    }
  }

  function updateHealthUI(online) {
    const dot = dom.healthDot;
    dot.classList.remove('health-online', 'health-offline', 'health-unknown');

    if (online) {
      dot.classList.add('health-online');
      dot.title = 'Server online';
      dot.setAttribute('aria-label', 'Server online');
      dom.offlineBanner.hidden = true;
    } else {
      dot.classList.add('health-offline');
      dot.title = 'Server offline';
      dot.setAttribute('aria-label', 'Server offline');
      dom.offlineBanner.hidden = false;
    }
  }

  async function runHealthCheck() {
    const online = await checkHealth();
    if (serverOnline !== online) {
      serverOnline = online;
      updateHealthUI(online);
    }
  }

  function startHealthChecks() {
    runHealthCheck();
    healthTimer = setInterval(runHealthCheck, HEALTH_INTERVAL_MS);
  }

  /* ===================== HISTORY ===================== */
  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      historyData = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(historyData)) historyData = [];
    } catch (e) {
      historyData = [];
    }
    renderHistoryList();
  }

  function saveHistory() {
    try {
      // Keep most recent entries
      if (historyData.length > MAX_HISTORY) {
        historyData = historyData.slice(-MAX_HISTORY);
      }
      localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  }

  function addHistoryEntry(entry) {
    // Remove existing entry with same taskId if any
    historyData = historyData.filter((h) => h.taskId !== entry.taskId);
    historyData.push(entry);
    saveHistory();
    renderHistoryList();
  }

  function renderHistoryList() {
    dom.historyList.innerHTML = '';

    if (historyData.length === 0) {
      dom.historyEmpty.style.display = '';
      return;
    }

    dom.historyEmpty.style.display = 'none';

    // Show newest first
    const reversed = [...historyData].reverse();

    for (const entry of reversed) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history-item';
      if (entry.taskId === currentTaskId) btn.classList.add('active');
      btn.setAttribute('role', 'listitem');

      const preview = document.createElement('span');
      preview.className = 'history-item-preview';
      preview.textContent = entry.preview || entry.taskId;

      const meta = document.createElement('span');
      meta.className = 'history-item-meta';
      meta.innerHTML =
        '<span class="history-tag">' + escapeHTML(entry.level || '?') + '</span>' +
        '<span class="history-tag">' + escapeHTML(entry.specialty || '?') + '</span>' +
        '<span>' + formatTime(entry.timestamp) + '</span>';

      btn.appendChild(preview);
      btn.appendChild(meta);

      btn.addEventListener('click', () => loadHistoryEntry(entry));

      dom.historyList.appendChild(btn);
    }
  }

  function loadHistoryEntry(entry) {
    if (isRunning) {
      alert('Please wait for the current task to finish.');
      return;
    }

    // Reset current state
    currentTaskId = entry.taskId;
    currentEvents = entry.events || [];
    previewUrl = entry.previewUrl || null;
    downloadUrl = entry.downloadUrl || null;

    // Re-render
    clearChatPanel();
    dom.chatWelcome.style.display = 'none';

    for (const evt of currentEvents) {
      appendEventBubble(evt, false);
    }

    // Show action buttons if applicable
    if (previewUrl || downloadUrl) {
      showActionBar(previewUrl, downloadUrl);
    } else {
      hideActionBar();
    }

    // Scroll to bottom
    scrollChatToBottom();
    renderHistoryList();
  }

  /* ===================== CHAT PANEL ===================== */
  function clearChatPanel() {
    dom.chatPanel.innerHTML = '';
    dom.chatWelcome.style.display = '';
    hideActionBar();
  }

  function clearChat() {
    currentTaskId = null;
    currentEvents = [];
    previewUrl = null;
    downloadUrl = null;
    clearChatPanel();
    renderHistoryList();
  }

  function scrollChatToBottom() {
    dom.chatPanel.scrollTop = dom.chatPanel.scrollHeight;
  }

  function appendEventBubble(eventData, animate = true) {
    // Hide welcome message when we have content
    dom.chatWelcome.style.display = 'none';

    const type = eventData.type || 'unknown';
    const message = prettyMessage(eventData.message || eventData.msg || eventData.log || eventData.content || eventData.data || '');
    const tokenCount = eventData.token_count ?? eventData.tokens ?? eventData.tokenCount ?? null;
    const model = eventData.model ?? eventData.model_name ?? eventData.modelName ?? null;
    const timestamp = eventData.timestamp || Date.now();

    const bubble = document.createElement('article');
    bubble.className = 'message-bubble';
    if (!animate) bubble.style.animation = 'none';
    bubble.setAttribute('aria-label', badgeLabel(type) + ' event');

    // Header
    const header = document.createElement('div');
    header.className = 'bubble-header';

    const badge = document.createElement('span');
    badge.className = 'badge ' + badgeClass(type);
    badge.textContent = badgeLabel(type);
    header.appendChild(badge);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'bubble-timestamp';
    timeSpan.textContent = formatTime(timestamp);
    header.appendChild(timeSpan);

    bubble.appendChild(header);

    // Message body
    if (message) {
      const pre = document.createElement('pre');
      pre.className = 'bubble-message';
      pre.textContent = message;
      bubble.appendChild(pre);
    }

    // Meta (tokens, model)
    if (tokenCount !== null || model) {
      const meta = document.createElement('div');
      meta.className = 'bubble-meta';

      if (tokenCount !== null) {
        const tok = document.createElement('span');
        tok.className = 'bubble-meta-item';
        tok.textContent = 'Tokens: ' + tokenCount;
        meta.appendChild(tok);
      }
      if (model) {
        const mod = document.createElement('span');
        mod.className = 'bubble-meta-item';
        mod.textContent = 'Model: ' + model;
        meta.appendChild(mod);
      }
      bubble.appendChild(meta);
    }

    dom.chatPanel.appendChild(bubble);
    scrollChatToBottom();
  }

  /* ===================== ACTION BAR ===================== */
  function showActionBar() {
    if (!currentTaskId || !currentUser) return;

    previewUrl = API_BASE + '/api/v1/preview/' + dom.specialtySelect.value + '/' + currentUser + '/' + currentTaskId + '/main/index.html';
    downloadUrl = API_BASE + '/api/v1/artifacts/' + currentTaskId;

    dom.btnPreview.hidden = false;
    dom.btnPreview.onclick = function() { window.open(previewUrl, '_blank', 'noopener'); };

    dom.btnDownload.hidden = false;
    dom.btnDownload.onclick = function() {
      var a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    dom.actionBar.hidden = false;
  }

  function hideActionBar() {
    dom.actionBar.hidden = true;
    previewUrl = null;
    downloadUrl = null;
    dom.btnPreview.hidden = true;
    dom.btnDownload.hidden = true;
  }

  /* ===================== SSE PROCESSING ===================== */
  async function processSSE(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep last potentially incomplete line in buffer
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line) continue;

          // SSE format: "data: {...}" or "data:{...}"
          if (line.startsWith('data:')) {
            const jsonStr = line.replace(/^data:\s*/, '');
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);
              handleSSEEvent(data);
            } catch (parseErr) {
              // Maybe multiple JSON objects concatenated; try splitting
              const parts = jsonStr.split(/(?<=\})\s*(?=\{)/);
              for (const part of parts) {
                const trimmed = part.trim();
                if (!trimmed) continue;
                try {
                  const data = JSON.parse(trimmed);
                  handleSSEEvent(data);
                } catch (e2) {
                  console.warn('SSE parse error for part:', trimmed.substring(0, 120), e2);
                }
              }
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        const line = buffer.trim();
        if (line.startsWith('data:')) {
          const jsonStr = line.replace(/^data:\s*/, '');
          if (jsonStr) {
            try {
              const data = JSON.parse(jsonStr);
              handleSSEEvent(data);
            } catch (e) {
              console.warn('SSE final parse error:', jsonStr.substring(0, 120), e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  function handleSSEEvent(data) {
    if (!data || typeof data !== 'object') return;

    const type = data.event || data.type || 'unknown';

    // Store event
    const eventObj = {
      ...data,
      _receivedAt: Date.now(),
    };
    currentEvents.push(eventObj);

    // Render bubble
    appendEventBubble(eventObj, false);

    // Handle task ID
    if (data.task_id && !currentTaskId) {
      currentTaskId = data.task_id;
    }

    // Handle completion
    if (type === 'task_complete' || type === 'run_finished') {
      showActionBar();
      // Save to history
      finishTask();
    }
  }

  function finishTask() {
    if (!currentTaskId) {
      currentTaskId = generateId();
    }

    const entry = {
      taskId: currentTaskId,
      preview: dom.taskInput.value.trim().substring(0, 80),
      timestamp: Date.now(),
      level: dom.levelSelect.value,
      specialty: dom.specialtySelect.value,
      user: currentUser,
      events: [...currentEvents],
    };

    addHistoryEntry(entry);
    setRunning(false);
  }

  /* ===================== RUN TASK ===================== */
  async function runTask() {
    if (isRunning) return;

    const task = dom.taskInput.value.trim();
    if (!task) {
      dom.taskInput.focus();
      return;
    }

    const level = dom.levelSelect.value;
    const specialty = dom.specialtySelect.value;

    // Reset state
    currentTaskId = generateId();
    currentEvents = [];
    previewUrl = null;
    downloadUrl = null;
    hideActionBar();
    clearChatPanel();

    // Append a "user" bubble for the task input
    appendEventBubble(
      {
        type: 'user',
        message: task,
        timestamp: Date.now(),
      },
      true
    );

    setRunning(true);

    try {
      const resp = await fetch(RUN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          level: level,
          specialty: specialty,
          task: task,
          user: currentUser,
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => 'Unknown error');
        throw new Error('HTTP ' + resp.status + ': ' + errorText);
      }

      // Check if response is SSE
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream')) {
        await processSSE(resp);
      } else {
        // Might be a plain JSON response
        const json = await resp.json();
        handleSSEEvent(json);
      }
    } catch (err) {
      console.error('Task execution error:', err);
      const errorEvent = {
        type: 'error',
        message: 'Request failed: ' + err.message,
        timestamp: Date.now(),
      };
      currentEvents.push(errorEvent);
      appendEventBubble(errorEvent, true);
      finishTask(null, null);
    }
  }

  function setRunning(running) {
    isRunning = running;
    dom.btnRun.disabled = running;
    dom.taskInput.disabled = running;
    dom.levelSelect.disabled = running;
    dom.specialtySelect.disabled = running;

    dom.btnRunText.hidden = running;
    dom.btnRunSpinner.hidden = !running;

    if (!running) {
      dom.taskInput.focus();
    }
  }

  /* ===================== EVENT LISTENERS ===================== */
  function bindEvents() {
    // Login form
    dom.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin(dom.loginUsername.value);
    });

    // Logout
    dom.btnLogout.addEventListener('click', logout);

    // New Chat
    dom.btnNewChat.addEventListener('click', () => {
      if (isRunning) {
        alert('Please wait for the current task to finish.');
        return;
      }
      clearChat();
      dom.taskInput.focus();
    });

    // Run button
    dom.btnRun.addEventListener('click', runTask);

    // Enter key in task input
    dom.taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!isRunning) runTask();
      }
    });

    // Enable Run button when input is non-empty
    dom.taskInput.addEventListener('input', () => {
      dom.btnRun.disabled = isRunning || dom.taskInput.value.trim().length === 0;
    });

    // Initial Run button state
    dom.btnRun.disabled = true;
  }

  /* ===================== INIT ===================== */
  function init() {
    bindEvents();

    // Check login first
    const loggedIn = checkLogin();

    if (loggedIn) {
      // Load history
      loadHistory();

      // Start health checks
      startHealthChecks();

      // Focus input
      dom.taskInput.focus();
    }

    console.log('Orcheeos Dashboard initialized.');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
