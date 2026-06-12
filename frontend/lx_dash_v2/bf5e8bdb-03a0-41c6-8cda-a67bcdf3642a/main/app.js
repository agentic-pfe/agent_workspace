/* ============================================================
   Orcheeos Platform Dashboard — Application Logic
   Real API integration with localhost:8000
   ============================================================ */

(function () {
  'use strict';

  // ---------- Configuration ----------
  const API_BASE = 'http://localhost:8000';
  const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  const TOAST_DURATION = 5000; // 5 seconds

  // ---------- Application State ----------
  const state = {
    token: null,
    user: null,
    conversations: [],
    currentConversationId: null,
    messages: [],
    isStreaming: false,
    streamAbortController: null,
    healthStatus: 'unknown', // 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
    healthCheckTimer: null,
    artifacts: [],
    isSidebarOpen: false,
    isArtifactsOpen: false,
  };

  // ---------- DOM References ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    // Login
    loginOverlay: $('#login-overlay'),
    loginForm: $('#login-form'),
    loginUsername: $('#login-username'),
    loginPassword: $('#login-password'),
    loginBtn: $('#login-btn'),
    loginError: $('#login-error'),
    usernameError: $('#username-error'),
    passwordError: $('#password-error'),

    // App
    appContainer: $('#app-container'),
    sidebar: $('#sidebar'),
    sidebarOverlay: $('#sidebar-overlay'),
    mainContent: $('#main-content'),

    // Header
    btnToggleSidebar: $('#btn-toggle-sidebar'),
    conversationTitle: $('#conversation-title'),
    healthIndicator: $('#health-indicator'),
    healthDot: $('#health-indicator .health-dot'),
    healthLabel: $('#health-indicator .health-label'),
    btnToggleArtifacts: $('#btn-toggle-artifacts'),

    // Chat
    chatMessages: $('#chat-messages'),
    welcomeMessage: $('#welcome-message'),
    chatInput: $('#chat-input'),
    btnSend: $('#btn-send'),
    btnStopStream: $('#btn-stop-stream'),

    // Sidebar
    btnNewChat: $('#btn-new-chat'),
    conversationList: $('#conversation-list'),
    historyLoading: $('#history-loading'),
    historyEmpty: $('#history-empty'),
    historyError: $('#history-error'),
    btnRetryHistory: $('#btn-retry-history'),
    btnLogout: $('#btn-logout'),
    userInitials: $('#user-initials'),
    userName: $('#user-name'),
    userRole: $('#user-role'),

    // Artifacts
    artifactsPanel: $('#artifacts-panel'),
    artifactsList: $('#artifacts-list'),
    artifactsEmpty: $('#artifacts-empty'),
    btnCloseArtifacts: $('#btn-close-artifacts'),

    // Toast
    toastContainer: $('#toast-container'),
  };

  // ---------- Helpers ----------

  /** Safely parse JSON, returning null on failure */
  function safeJSON(text) {
    try { return JSON.parse(text); } catch { return null; }
  }

  /** Format a date string for display */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  /** Escape HTML to prevent XSS */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Simple markdown-to-HTML converter for chat messages */
  function renderMarkdown(text) {
    if (!text) return '';

    // Escape HTML first
    let html = escapeHTML(text);

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const langLabel = lang ? `<span class="code-lang">${escapeHTML(lang)}</span>` : '';
      return `<pre>${langLabel}<code>${code.trim()}</code></pre>`;
    });

    // Inline code (`...`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold (**...**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic (*...*)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Line breaks for paragraphs (double newline)
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Single newlines → <br>
    html = html.replace(/\n/g, '<br>');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    return html;
  }

  /** Get auth headers for fetch requests */
  function authHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }
    return headers;
  }

  /** Show a toast notification */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const icons = {
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    };

    toast.innerHTML = `${icons[type] || icons.info}<span>${escapeHTML(message)}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, TOAST_DURATION);
  }

  // ---------- Auth Module ----------

  function getStoredToken() {
    try {
      return localStorage.getItem('orcheeos_token');
    } catch {
      return null;
    }
  }

  function setStoredToken(token) {
    try {
      localStorage.setItem('orcheeos_token', token);
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  }

  function clearStoredToken() {
    try {
      localStorage.removeItem('orcheeos_token');
      localStorage.removeItem('orcheeos_user');
    } catch { /* ignore */ }
  }

  function getStoredUser() {
    try {
      const raw = localStorage.getItem('orcheeos_user');
      return raw ? safeJSON(raw) : null;
    } catch {
      return null;
    }
  }

  function setStoredUser(user) {
    try {
      localStorage.setItem('orcheeos_user', JSON.stringify(user));
    } catch { /* ignore */ }
  }

  /** Attempt login via POST /auth/login */
  async function login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errMsg = 'Invalid credentials. Please try again.';
      try {
        const parsed = JSON.parse(errBody);
        errMsg = parsed.detail || parsed.message || errMsg;
      } catch { /* use default */ }
      throw new Error(errMsg);
    }

    const data = await response.json();
    const token = data.access_token || data.token;
    if (!token) {
      throw new Error('No token received from server.');
    }

    state.token = token;
    setStoredToken(token);

    // Store user info if available
    const user = {
      username: data.username || username,
      role: data.role || 'Member',
      initials: (data.username || username).slice(0, 2).toUpperCase(),
    };
    state.user = user;
    setStoredUser(user);

    return { token, user };
  }

  function logout() {
    // Abort any ongoing stream
    if (state.streamAbortController) {
      state.streamAbortController.abort();
      state.streamAbortController = null;
    }

    // Clear state
    state.token = null;
    state.user = null;
    state.conversations = [];
    state.currentConversationId = null;
    state.messages = [];
    state.isStreaming = false;
    state.artifacts = [];

    // Clear storage
    clearStoredToken();

    // Stop health checks
    stopHealthChecks();

    // Show login, hide app
    dom.appContainer.style.display = 'none';
    dom.loginOverlay.style.display = 'flex';
    dom.loginForm.reset();
    dom.loginError.textContent = '';
    dom.usernameError.textContent = '';
    dom.passwordError.textContent = '';

    // Reset UI
    resetChatUI();
  }

  /** Try to restore session from stored token */
  async function restoreSession() {
    const token = getStoredToken();
    if (!token) return false;

    state.token = token;
    const user = getStoredUser();
    if (user) state.user = user;

    // Verify token by hitting health endpoint (or a dedicated /auth/me)
    try {
      const response = await fetch(`${API_BASE}/health`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      return true;
    } catch {
      // Token invalid or server unreachable
      state.token = null;
      state.user = null;
      clearStoredToken();
      return false;
    }
  }

  // ---------- Health Check ----------

  async function checkHealth() {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        headers: state.token ? { 'Authorization': `Bearer ${state.token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok' || data.status === 'healthy') {
          setHealthStatus('healthy');
        } else {
          setHealthStatus('degraded');
        }
      } else {
        setHealthStatus('degraded');
      }
    } catch {
      setHealthStatus('unhealthy');
    }
  }

  function setHealthStatus(status) {
    state.healthStatus = status;
    const dot = dom.healthDot;
    const label = dom.healthLabel;

    dot.className = 'health-dot ' + status;

    switch (status) {
      case 'healthy':
        label.textContent = 'System Online';
        break;
      case 'degraded':
        label.textContent = 'Degraded';
        break;
      case 'unhealthy':
        label.textContent = 'Offline';
        break;
      default:
        label.textContent = 'Checking...';
        dot.className = 'health-dot';
    }
  }

  function startHealthChecks() {
    checkHealth(); // immediate first check
    state.healthCheckTimer = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
  }

  function stopHealthChecks() {
    if (state.healthCheckTimer) {
      clearInterval(state.healthCheckTimer);
      state.healthCheckTimer = null;
    }
  }

  // ---------- History / Conversations ----------

  async function fetchConversations() {
    dom.historyLoading.style.display = 'block';
    dom.historyEmpty.style.display = 'none';
    dom.historyError.style.display = 'none';

    try {
      const response = await fetch(`${API_BASE}/api/conversations`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      // Support both array responses and { conversations: [...] } structures
      const conversations = Array.isArray(data) ? data : (data.conversations || data.items || []);

      state.conversations = conversations;
      renderConversationList();

      if (conversations.length === 0) {
        dom.historyEmpty.style.display = 'block';
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      dom.historyError.style.display = 'block';
    } finally {
      dom.historyLoading.style.display = 'none';
    }
  }

  function renderConversationList() {
    const list = dom.conversationList;
    list.innerHTML = '';

    if (state.conversations.length === 0) {
      dom.historyEmpty.style.display = 'block';
      return;
    }

    dom.historyEmpty.style.display = 'none';

    state.conversations.forEach((conv) => {
      const li = document.createElement('li');
      li.className = 'conversation-item';
      if (conv.id === state.currentConversationId) {
        li.classList.add('active');
        li.setAttribute('aria-current', 'page');
      }
      li.setAttribute('role', 'listitem');
      li.setAttribute('tabindex', '0');

      li.innerHTML = `
        <span class="conversation-item-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </span>
        <div class="conversation-item-content">
          <div class="conversation-item-title">${escapeHTML(conv.title || 'Untitled Conversation')}</div>
          <div class="conversation-item-date">${formatDate(conv.updated_at || conv.created_at)}</div>
        </div>
        <button class="btn btn-ghost btn-icon conversation-item-actions btn-delete-convo" 
                aria-label="Delete conversation" data-convo-id="${escapeHTML(conv.id)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      `;

      // Click to load conversation
      li.addEventListener('click', (e) => {
        // Don't trigger if delete button was clicked
        if (e.target.closest('.btn-delete-convo')) return;
        loadConversation(conv.id);
      });

      // Keyboard support
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadConversation(conv.id);
        }
      });

      list.appendChild(li);
    });

    // Attach delete handlers
    list.querySelectorAll('.btn-delete-convo').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const convoId = btn.getAttribute('data-convo-id');
        deleteConversation(convoId);
      });
    });
  }

  async function loadConversation(conversationId) {
    if (state.isStreaming) {
      showToast('Please wait for the current response to finish.', 'warning');
      return;
    }

    // Update UI selection
    state.currentConversationId = conversationId;
    renderConversationList();

    // Update title
    const conv = state.conversations.find((c) => c.id === conversationId);
    if (conv) {
      dom.conversationTitle.textContent = conv.title || 'Conversation';
    }

    try {
      const response = await fetch(`${API_BASE}/api/conversations/${conversationId}`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const messages = Array.isArray(data) ? data : (data.messages || data.items || []);

      state.messages = messages;
      renderAllMessages();
      dom.welcomeMessage.style.display = 'none';

      // Load artifacts if any
      if (data.artifacts && data.artifacts.length > 0) {
        state.artifacts = data.artifacts;
        renderArtifacts();
        dom.btnToggleArtifacts.style.display = 'flex';
      } else {
        state.artifacts = [];
        dom.artifactsList.innerHTML = '';
        dom.artifactsEmpty.style.display = 'flex';
        dom.btnToggleArtifacts.style.display = 'none';
        closeArtifactsPanel();
      }

      // Close sidebar on mobile
      closeSidebar();
    } catch (err) {
      console.error('Failed to load conversation:', err);
      showToast('Failed to load conversation. Please try again.', 'error');
    }
  }

  async function deleteConversation(conversationId) {
    if (!confirm('Delete this conversation?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Remove from local state
      state.conversations = state.conversations.filter((c) => c.id !== conversationId);

      // If we deleted the current conversation, reset
      if (state.currentConversationId === conversationId) {
        state.currentConversationId = null;
        state.messages = [];
        state.artifacts = [];
        dom.conversationTitle.textContent = 'New Conversation';
        resetChatUI();
        closeArtifactsPanel();
        dom.btnToggleArtifacts.style.display = 'none';
      }

      renderConversationList();
      showToast('Conversation deleted.', 'success');
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      showToast('Failed to delete conversation.', 'error');
    }
  }

  async function createConversation(firstMessage) {
    try {
      const response = await fetch(`${API_BASE}/api/conversations`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '...' : ''),
          first_message: firstMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const conv = data.conversation || data;
        state.currentConversationId = conv.id;
        dom.conversationTitle.textContent = conv.title || 'Conversation';

        // Refresh conversation list
        await fetchConversations();

        // Select the new conversation in the list
        renderConversationList();
      } else {
        // If endpoint doesn't exist, use a local ID
        state.currentConversationId = 'local-' + Date.now();
        dom.conversationTitle.textContent = firstMessage.slice(0, 60);
      }
    } catch {
      // Fallback: use a local ID
      state.currentConversationId = 'local-' + Date.now();
      dom.conversationTitle.textContent = firstMessage.slice(0, 60);
    }
  }

  // ---------- Chat / Messaging ----------

  function resetChatUI() {
    dom.chatMessages.innerHTML = '';
    dom.welcomeMessage.style.display = 'flex';
    dom.conversationTitle.textContent = 'New Conversation';
  }

  function renderAllMessages() {
    dom.chatMessages.innerHTML = '';
    dom.welcomeMessage.style.display = 'none';

    state.messages.forEach((msg) => {
      appendMessageToDOM(msg);
    });

    scrollToBottom();
  }

  function appendMessageToDOM(msg) {
    // Remove welcome message if present
    dom.welcomeMessage.style.display = 'none';

    const row = document.createElement('div');
    row.className = `message-row ${msg.role}`;
    row.setAttribute('role', 'article');

    const avatarInitial = msg.role === 'user'
      ? (state.user?.initials || 'U')
      : 'AI';

    const avatarClass = msg.role === 'user' ? 'user-avatar-msg' : 'assistant-avatar';

    row.innerHTML = `
      <div class="message-avatar ${avatarClass}" aria-hidden="true">${escapeHTML(avatarInitial)}</div>
      <div class="message-body">
        ${renderMarkdown(msg.content || '')}
      </div>
    `;

    dom.chatMessages.appendChild(row);
    scrollToBottom();
  }

  /** Create a new assistant message bubble for streaming */
  function createStreamingBubble() {
    dom.welcomeMessage.style.display = 'none';

    const row = document.createElement('div');
    row.className = 'message-row assistant';
    row.setAttribute('role', 'article');
    row.id = 'streaming-message';

    row.innerHTML = `
      <div class="message-avatar assistant-avatar" aria-hidden="true">AI</div>
      <div class="message-body">
        <p><span class="streaming-cursor" aria-hidden="true"></span></p>
      </div>
    `;

    dom.chatMessages.appendChild(row);
    scrollToBottom();
    return row;
  }

  function appendStreamToken(token) {
    const streamingMsg = document.getElementById('streaming-message');
    if (!streamingMsg) return;

    const body = streamingMsg.querySelector('.message-body');
    const cursor = body.querySelector('.streaming-cursor');
    if (!cursor) return;

    // Insert text before the cursor
    const textNode = document.createTextNode(token);
    cursor.parentNode.insertBefore(textNode, cursor);

    scrollToBottom();
  }

  function finalizeStreamingMessage(fullContent) {
    const streamingMsg = document.getElementById('streaming-message');
    if (!streamingMsg) return;

    // Remove streaming ID and cursor
    streamingMsg.removeAttribute('id');
    const cursor = streamingMsg.querySelector('.streaming-cursor');
    if (cursor) cursor.remove();

    // Re-render with markdown
    const body = streamingMsg.querySelector('.message-body');
    body.innerHTML = renderMarkdown(fullContent);

    // Add to state
    state.messages.push({
      role: 'assistant',
      content: fullContent,
    });

    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    });
  }

  /** Send a message and stream the response */
  async function sendMessage(messageText) {
    if (!messageText.trim() || state.isStreaming) return;

    const message = messageText.trim();
    dom.chatInput.value = '';
    resizeTextarea();
    updateSendButton();

    // Create conversation if needed
    if (!state.currentConversationId) {
      await createConversation(message);
    }

    // Add user message to state and DOM
    const userMsg = { role: 'user', content: message };
    state.messages.push(userMsg);
    appendMessageToDOM(userMsg);

    // Create streaming bubble
    createStreamingBubble();

    // Start streaming
    state.isStreaming = true;
    dom.btnStopStream.style.display = 'flex';
    dom.btnSend.style.display = 'none';
    dom.chatInput.disabled = true;

    const controller = new AbortController();
    state.streamAbortController = controller;

    let fullContent = '';

    try {
      const url = new URL(`${API_BASE}/chat/stream`);
      url.searchParams.set('message', message);
      if (state.currentConversationId) {
        url.searchParams.set('conversation_id', state.currentConversationId);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Accept': 'text/event-stream',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line

        for (const line of lines) {
          const trimmed = line.trim();

          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6).trim();

            if (data === '[DONE]') {
              // Stream complete
              break;
            }

            // Try JSON parse first
            const parsed = safeJSON(data);
            if (parsed) {
              const token = parsed.token || parsed.content || parsed.text || parsed.delta || '';
              if (token) {
                fullContent += token;
                appendStreamToken(token);
              }
              // Check for artifacts in the stream
              if (parsed.artifact || parsed.artifacts) {
                const arts = parsed.artifacts || [parsed.artifact];
                handleStreamArtifacts(arts);
              }
            } else {
              // Plain text token
              fullContent += data;
              appendStreamToken(data);
            }
          } else if (trimmed.startsWith('event: ')) {
            // Handle named events if needed
            const eventType = trimmed.slice(7).trim();
            if (eventType === 'artifact') {
              // Next data line will contain artifact info
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim().startsWith('data: ')) {
        const data = buffer.trim().slice(6).trim();
        if (data && data !== '[DONE]') {
          const parsed = safeJSON(data);
          if (parsed) {
            const token = parsed.token || parsed.content || parsed.text || parsed.delta || '';
            if (token) {
              fullContent += token;
              appendStreamToken(token);
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled - keep whatever content we have
        fullContent += ' [cancelled]';
      } else {
        console.error('Stream error:', err);
        fullContent += '\n\n*[Error: Failed to get complete response. Please try again.]*';
        showToast('Stream error. Please check your connection.', 'error');
      }
    } finally {
      state.isStreaming = false;
      state.streamAbortController = null;
      dom.btnStopStream.style.display = 'none';
      dom.btnSend.style.display = 'flex';
      dom.chatInput.disabled = false;
      dom.chatInput.focus();
      updateSendButton();

      // Finalize the streaming message
      if (fullContent) {
        finalizeStreamingMessage(fullContent);
      } else {
        // Remove empty streaming bubble
        const streamingMsg = document.getElementById('streaming-message');
        if (streamingMsg) streamingMsg.remove();
      }

      // Refresh conversation list (title may have been updated server-side)
      fetchConversations();
    }
  }

  function stopStreaming() {
    if (state.streamAbortController) {
      state.streamAbortController.abort();
      state.streamAbortController = null;
    }
  }

  function handleStreamArtifacts(artifacts) {
    artifacts.forEach((art) => {
      // Avoid duplicates
      if (!state.artifacts.find((a) => a.id === art.id)) {
        state.artifacts.push(art);
      }
    });
    renderArtifacts();
    dom.btnToggleArtifacts.style.display = 'flex';

    // Auto-open artifacts panel on first artifact
    if (state.artifacts.length === 1 && !state.isArtifactsOpen) {
      openArtifactsPanel();
    }
  }

  // ---------- Artifacts ----------

  function renderArtifacts() {
    const list = dom.artifactsList;
    list.innerHTML = '';

    if (state.artifacts.length === 0) {
      dom.artifactsEmpty.style.display = 'flex';
      return;
    }

    dom.artifactsEmpty.style.display = 'none';

    state.artifacts.forEach((artifact) => {
      const card = document.createElement('div');
      card.className = 'artifact-card';

      const typeIcon = getArtifactTypeIcon(artifact.type || artifact.kind);
      const previewContent = getArtifactPreview(artifact);

      card.innerHTML = `
        <div class="artifact-card-header">
          <span class="artifact-card-type">
            ${typeIcon}
            ${escapeHTML(artifact.type || artifact.kind || 'artifact')}
          </span>
          <div class="artifact-card-actions">
            <button class="btn btn-ghost btn-icon btn-sm btn-copy-artifact" 
                    aria-label="Copy artifact content" data-artifact-id="${escapeHTML(artifact.id)}" title="Copy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </button>
            <a class="btn btn-ghost btn-icon btn-sm" 
               href="${API_BASE}/artifacts/${escapeHTML(artifact.id)}/download" 
               target="_blank" rel="noopener" aria-label="Download artifact" title="Download"
               onclick="event.stopPropagation()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="artifact-card-preview">
          <pre><code>${escapeHTML(previewContent)}</code></pre>
        </div>
        <div class="artifact-card-footer">
          <span class="artifact-card-filename">${escapeHTML(artifact.filename || artifact.title || artifact.id)}</span>
          <span class="artifact-card-filename">${escapeHTML(artifact.size || '')}</span>
        </div>
      `;

      // Copy handler
      card.querySelector('.btn-copy-artifact')?.addEventListener('click', async () => {
        try {
          const content = artifact.content || artifact.preview || previewContent;
          await navigator.clipboard.writeText(content);
          showToast('Copied to clipboard!', 'success');
        } catch {
          showToast('Failed to copy.', 'error');
        }
      });

      list.appendChild(card);
    });
  }

  function getArtifactTypeIcon(type) {
    const t = (type || '').toLowerCase();
    if (t.includes('code') || t.includes('script') || t.includes('python') || t.includes('js')) {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    }
    if (t.includes('image') || t.includes('img')) {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    }
    if (t.includes('doc') || t.includes('text') || t.includes('pdf')) {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    }
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>';
  }

  function getArtifactPreview(artifact) {
    if (artifact.preview) {
      return typeof artifact.preview === 'string' ? artifact.preview : JSON.stringify(artifact.preview, null, 2);
    }
    if (artifact.content) {
      const c = typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content, null, 2);
      return c.length > 500 ? c.slice(0, 500) + '...' : c;
    }
    return '(No preview available)';
  }

  function openArtifactsPanel() {
    state.isArtifactsOpen = true;
    dom.artifactsPanel.style.display = 'flex';
    dom.artifactsPanel.classList.add('open');
    dom.appContainer.classList.add('artifacts-open');
    dom.btnToggleArtifacts.setAttribute('aria-expanded', 'true');
  }

  function closeArtifactsPanel() {
    state.isArtifactsOpen = false;
    dom.artifactsPanel.classList.remove('open');
    dom.appContainer.classList.remove('artifacts-open');
    dom.btnToggleArtifacts.setAttribute('aria-expanded', 'false');

    // Hide after transition
    setTimeout(() => {
      if (!state.isArtifactsOpen) {
        dom.artifactsPanel.style.display = 'none';
      }
    }, 400);
  }

  function toggleArtifactsPanel() {
    if (state.isArtifactsOpen) {
      closeArtifactsPanel();
    } else {
      openArtifactsPanel();
    }
  }

  // ---------- Sidebar ----------

  function openSidebar() {
    state.isSidebarOpen = true;
    dom.sidebar.classList.add('open');
    dom.sidebarOverlay.style.display = 'block';
    dom.sidebarOverlay.setAttribute('aria-hidden', 'false');
    dom.btnToggleSidebar.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    state.isSidebarOpen = false;
    dom.sidebar.classList.remove('open');
    dom.sidebarOverlay.style.display = 'none';
    dom.sidebarOverlay.setAttribute('aria-hidden', 'true');
    dom.btnToggleSidebar.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    if (state.isSidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // ---------- Textarea Auto-resize ----------

  function resizeTextarea() {
    const textarea = dom.chatInput;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = newHeight + 'px';
  }

  function updateSendButton() {
    const hasText = dom.chatInput.value.trim().length > 0;
    dom.btnSend.disabled = !hasText || state.isStreaming;
  }

  // ---------- Event Handlers ----------

  // Login form submission
  dom.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    dom.loginError.textContent = '';
    dom.usernameError.textContent = '';
    dom.passwordError.textContent = '';

    const username = dom.loginUsername.value.trim();
    const password = dom.loginPassword.value;

    // Basic validation
    let hasError = false;
    if (!username) {
      dom.usernameError.textContent = 'Username is required.';
      hasError = true;
    }
    if (!password) {
      dom.passwordError.textContent = 'Password is required.';
      hasError = true;
    }
    if (hasError) return;

    // Show loading state
    dom.loginBtn.classList.add('loading');
    dom.loginBtn.disabled = true;

    try {
      await login(username, password);
      await onLoginSuccess();
    } catch (err) {
      dom.loginError.textContent = err.message || 'Login failed. Please try again.';
      dom.loginError.style.display = 'block';
    } finally {
      dom.loginBtn.classList.remove('loading');
      dom.loginBtn.disabled = false;
    }
  });

  async function onLoginSuccess() {
    // Hide login, show app
    dom.loginOverlay.style.display = 'none';
    dom.appContainer.style.display = '';

    // Update user info in sidebar
    if (state.user) {
      dom.userInitials.textContent = state.user.initials || '?';
      dom.userName.textContent = state.user.username || 'User';
      dom.userRole.textContent = state.user.role || 'Member';
    }

    // Start health checks
    startHealthChecks();

    // Load conversations
    fetchConversations();

    // Focus chat input
    dom.chatInput.focus();

    showToast('Welcome back! System connected.', 'success');
  }

  // Send message
  dom.btnSend.addEventListener('click', () => {
    const text = dom.chatInput.value.trim();
    if (text) sendMessage(text);
  });

  // Stop streaming
  dom.btnStopStream.addEventListener('click', stopStreaming);

  // Chat input keydown
  dom.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = dom.chatInput.value.trim();
      if (text && !state.isStreaming) sendMessage(text);
    }
  });

  // Chat input changes
  dom.chatInput.addEventListener('input', () => {
    resizeTextarea();
    updateSendButton();
  });

  // New chat button
  dom.btnNewChat.addEventListener('click', () => {
    if (state.isStreaming) {
      showToast('Please wait for the current response to finish.', 'warning');
      return;
    }
    state.currentConversationId = null;
    state.messages = [];
    state.artifacts = [];
    dom.conversationTitle.textContent = 'New Conversation';
    resetChatUI();
    closeArtifactsPanel();
    dom.btnToggleArtifacts.style.display = 'none';
    dom.artifactsList.innerHTML = '';
    dom.artifactsEmpty.style.display = 'flex';
    renderConversationList();
    dom.chatInput.focus();
    closeSidebar();
  });

  // Toggle sidebar
  dom.btnToggleSidebar.addEventListener('click', toggleSidebar);
  dom.sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isSidebarOpen) closeSidebar();
      if (state.isArtifactsOpen) closeArtifactsPanel();
    }
  });

  // Logout
  dom.btnLogout.addEventListener('click', logout);

  // Retry history
  dom.btnRetryHistory.addEventListener('click', fetchConversations);

  // Toggle artifacts
  dom.btnToggleArtifacts.addEventListener('click', toggleArtifactsPanel);
  dom.btnCloseArtifacts.addEventListener('click', closeArtifactsPanel);

  // Welcome suggestion chips
  dom.chatMessages.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (chip && !state.isStreaming) {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        dom.chatInput.value = prompt;
        resizeTextarea();
        updateSendButton();
        sendMessage(prompt);
      }
    }
  });

  // Handle window resize for responsive sidebar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && state.isSidebarOpen) {
      // On desktop, sidebar is always visible via CSS; reset overlay state
      dom.sidebarOverlay.style.display = 'none';
    }
  });

  // ---------- Initialization ----------

  async function init() {
    // Try to restore session
    const restored = await restoreSession();

    if (restored) {
      // Session restored - show app directly
      dom.loginOverlay.style.display = 'none';
      dom.appContainer.style.display = '';

      if (state.user) {
        dom.userInitials.textContent = state.user.initials || '?';
        dom.userName.textContent = state.user.username || 'User';
        dom.userRole.textContent = state.user.role || 'Member';
      }

      startHealthChecks();
      fetchConversations();
      showToast('Session restored.', 'success');
    } else {
      // Show login screen
      dom.loginOverlay.style.display = 'flex';
      dom.appContainer.style.display = 'none';
      dom.loginUsername.focus();
    }

    // Init send button state
    updateSendButton();
  }

  // Boot
  init();
})();
