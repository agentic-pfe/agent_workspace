/**
 * Orcheeos Platform Dashboard — app.js
 * Single-page application with modular architecture.
 * Features: localStorage auth, mock SSE stream, chat, file preview/download, health checks.
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/** Generate a simple unique ID */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Format a Date to HH:MM:SS string */
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour12: false });
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Scroll an element to the bottom */
function scrollToBottom(el) {
  requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;
  });
}

/* ============================================================
   DOM REFERENCE CACHE
   ============================================================ */

const DOM = {
  // Views
  loginView: document.getElementById('login-view'),
  dashboardView: document.getElementById('dashboard-view'),

  // Login
  loginForm: document.getElementById('login-form'),
  usernameInput: document.getElementById('username'),
  passwordInput: document.getElementById('password'),
  usernameError: document.getElementById('username-error'),
  passwordError: document.getElementById('password-error'),
  loginGlobalError: document.getElementById('login-global-error'),
  loginBtn: document.getElementById('login-btn'),

  // Topbar
  currentUserDisplay: document.getElementById('current-user-display'),
  logoutBtn: document.getElementById('logout-btn'),
  sidebarToggle: document.getElementById('sidebar-toggle'),

  // Sidebar
  sidebar: document.getElementById('sidebar'),

  // Health
  healthGrid: document.getElementById('health-grid'),

  // Files
  fileList: document.getElementById('file-list'),

  // SSE
  sseFeed: document.getElementById('sse-feed'),
  sseStatus: document.getElementById('sse-status'),

  // Chat
  chatMessages: document.getElementById('chat-messages'),
  chatForm: document.getElementById('chat-form'),
  chatInput: document.getElementById('chat-input'),

  // Modal
  filePreviewModal: document.getElementById('file-preview-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-body'),
  modalDownload: document.getElementById('modal-download'),
  modalClose: document.getElementById('modal-close'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
};

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */

const STATE = {
  currentUser: null,
  sseConnected: false,
  sseIntervalId: null,
  healthIntervalId: null,
  chatHistory: [],
  isLoggingIn: false,
};

/* ============================================================
   AUTH MODULE
   ============================================================ */

const Auth = {
  /** Check stored session and show appropriate view */
  init() {
    const stored = localStorage.getItem('orcheeos_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (session && session.username && session.expiresAt > Date.now()) {
          STATE.currentUser = session.username;
          this.showDashboard();
          return;
        }
      } catch (_) { /* corrupted session — ignore */ }
      localStorage.removeItem('orcheeos_session');
    }
    this.showLogin();
  },

  /** Display the login view */
  showLogin() {
    DOM.loginView.classList.remove('view--hidden');
    DOM.dashboardView.classList.add('view--hidden');
    DOM.loginForm.reset();
    this.clearErrors();
    DOM.usernameInput.focus();
  },

  /** Display the dashboard view */
  showDashboard() {
    DOM.loginView.classList.add('view--hidden');
    DOM.dashboardView.classList.remove('view--hidden');
    DOM.currentUserDisplay.textContent = STATE.currentUser || 'User';
    SSE.connect();
    Health.start();
    Files.render();
    Chat.renderHistory();
  },

  /** Clear all form error states */
  clearErrors() {
    DOM.usernameError.classList.remove('form-error--visible');
    DOM.passwordError.classList.remove('form-error--visible');
    DOM.loginGlobalError.classList.remove('form-error--visible');
    DOM.usernameInput.classList.remove('input--error');
    DOM.passwordInput.classList.remove('input--error');
    DOM.loginGlobalError.textContent = '';
  },

  /** Validate login form fields */
  validate(username, password) {
    let valid = true;
    this.clearErrors();

    if (!username || username.trim().length < 2) {
      DOM.usernameError.textContent = 'Username must be at least 2 characters.';
      DOM.usernameError.classList.add('form-error--visible');
      DOM.usernameInput.classList.add('input--error');
      valid = false;
    }

    if (!password || password.trim().length < 3) {
      DOM.passwordError.textContent = 'Password must be at least 3 characters.';
      DOM.passwordError.classList.add('form-error--visible');
      DOM.passwordInput.classList.add('input--error');
      valid = false;
    }

    return valid;
  },

  /** Handle login form submission */
  async login(username, password) {
    if (STATE.isLoggingIn) return;
    STATE.isLoggingIn = true;

    DOM.loginBtn.classList.add('btn--loading');
    DOM.loginBtn.disabled = true;

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    // Demo auth: any username + password "admin"
    if (password === 'admin') {
      STATE.currentUser = username.trim();
      const session = {
        username: STATE.currentUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      };
      localStorage.setItem('orcheeos_session', JSON.stringify(session));
      this.showDashboard();
    } else {
      DOM.loginGlobalError.textContent = 'Invalid credentials. Demo password is "admin".';
      DOM.loginGlobalError.classList.add('form-error--visible');
    }

    DOM.loginBtn.classList.remove('btn--loading');
    DOM.loginBtn.disabled = false;
    STATE.isLoggingIn = false;
  },

  /** Log out the current user */
  logout() {
    localStorage.removeItem('orcheeos_session');
    STATE.currentUser = null;
    STATE.chatHistory = [];
    SSE.disconnect();
    Health.stop();
    this.showLogin();
  },
};

/* ============================================================
   SSE (Server-Sent Events) MODULE — Mock Implementation
   ============================================================ */

const SSE = {
  /** Sample events to cycle through */
  events: [
    { event: 'task_update', data: 'Task "ML Pipeline #42" status changed to running' },
    { event: 'node_heartbeat', data: 'Node "gpu-worker-03" reported healthy at 98% capacity' },
    { event: 'deployment', data: 'Deployment "orcheeos-api-v2.1.3" rolled out to 12 pods' },
    { event: 'alert', data: 'Memory usage on "inference-cluster" exceeded 82% threshold' },
    { event: 'task_update', data: 'Task "Data Sync #118" completed successfully in 3.4s' },
    { event: 'node_heartbeat', data: 'Node "cpu-worker-07" joined the cluster' },
    { event: 'deployment', data: 'Canary deployment "fe-experiment" receiving 5% traffic' },
    { event: 'alert', data: 'SSL certificate for api.orcheeos.io expires in 14 days' },
    { event: 'task_update', data: 'Task "Model Training #203" epoch 47/100 – loss: 0.0213' },
    { event: 'node_heartbeat', data: 'Node "gpu-worker-01" temperature at 72°C (normal)' },
    { event: 'stream_info', data: 'Orchestration engine version 4.2.0 loaded' },
    { event: 'alert', data: 'Disk usage on "storage-cluster" at 68% – cleanup recommended' },
  ],

  eventIndex: 0,

  /** Connect to the mock SSE stream */
  connect() {
    if (STATE.sseConnected) return;
    STATE.sseConnected = true;

    DOM.sseFeed.innerHTML = '';
    DOM.sseStatus.classList.remove('status-dot--disconnected');
    DOM.sseStatus.classList.add('status-dot--live');
    DOM.sseStatus.setAttribute('aria-label', 'Stream connected');

    this.appendEntry('info', 'stream', 'Connected to Orcheeos event stream');
    this.appendEntry('info', 'stream', `Session started at ${formatTime(new Date())}`);

    // Dispatch events every 1.5–3 seconds
    this.scheduleNext();
  },

  /** Schedule the next mock event */
  scheduleNext() {
    if (!STATE.sseConnected) return;
    const delay = 1500 + Math.random() * 1500;
    STATE.sseIntervalId = setTimeout(() => {
      this.dispatchNext();
      this.scheduleNext();
    }, delay);
  },

  /** Dispatch the next event in the cycle */
  dispatchNext() {
    const ev = this.events[this.eventIndex % this.events.length];
    this.eventIndex++;
    this.appendEntry('event', ev.event, ev.data);
  },

  /** Append an entry to the SSE feed */
  appendEntry(type, eventName, data) {
    const entry = document.createElement('div');
    entry.className = 'sse-entry';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'sse-entry__time';
    timeSpan.textContent = formatTime(new Date());

    const eventSpan = document.createElement('span');
    eventSpan.className = 'sse-entry__event';
    eventSpan.textContent = `[${eventName}]`;

    const dataSpan = document.createElement('span');
    dataSpan.className = 'sse-entry__data';
    dataSpan.textContent = ` ${data}`;

    entry.appendChild(timeSpan);
    entry.appendChild(eventSpan);
    entry.appendChild(dataSpan);
    DOM.sseFeed.appendChild(entry);

    // Limit feed to 50 entries
    while (DOM.sseFeed.children.length > 50) {
      DOM.sseFeed.firstElementChild.remove();
    }

    scrollToBottom(DOM.sseFeed);
  },

  /** Disconnect the mock SSE stream */
  disconnect() {
    STATE.sseConnected = false;
    if (STATE.sseIntervalId) {
      clearTimeout(STATE.sseIntervalId);
      STATE.sseIntervalId = null;
    }
    DOM.sseStatus.classList.remove('status-dot--live');
    DOM.sseStatus.classList.add('status-dot--disconnected');
    DOM.sseStatus.setAttribute('aria-label', 'Stream disconnected');
    this.appendEntry('info', 'stream', 'Disconnected from event stream');
  },
};

/* ============================================================
   CHAT MODULE
   ============================================================ */

const Chat = {
  /** Pre-defined bot responses for demo */
  botReplies: [
    "I've analyzed the pipeline metrics. Everything is running within expected parameters.",
    'The latest model checkpoint has been saved to the artifact store.',
    "Let me check the cluster status... All 12 nodes are healthy and operational.",
    'Your deployment was successful. The new version is now serving traffic.',
    "I've triggered a data validation job. You'll receive results in ~2 minutes.",
    'The anomaly detection system flagged 3 data points in the last batch. Would you like me to investigate?',
    'Resource utilization is at 62% across the cluster. Plenty of headroom available.',
    "I've scheduled the maintenance window for Sunday 02:00–04:00 UTC as requested.",
  ],

  replyIndex: 0,

  /** Add a message to the chat */
  addMessage(text, sender) {
    const msg = {
      id: uid(),
      text,
      sender, // 'user' | 'bot'
      timestamp: new Date(),
    };
    STATE.chatHistory.push(msg);
    this.renderMessage(msg);
  },

  /** Render a single message in the DOM */
  renderMessage(msg) {
    // Remove placeholder if present
    const placeholder = DOM.chatMessages.querySelector('.chat-placeholder');
    if (placeholder) placeholder.remove();

    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg chat-msg--${msg.sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg__bubble';
    bubble.textContent = msg.text;

    const timeEl = document.createElement('div');
    timeEl.className = 'chat-msg__time';
    timeEl.textContent = formatTime(msg.timestamp);

    wrapper.appendChild(bubble);
    wrapper.appendChild(timeEl);
    DOM.chatMessages.appendChild(wrapper);

    scrollToBottom(DOM.chatMessages);
  },

  /** Render entire chat history (after login) */
  renderHistory() {
    DOM.chatMessages.innerHTML = '';
    if (STATE.chatHistory.length === 0) {
      DOM.chatMessages.innerHTML = '<p class="chat-placeholder">No messages yet. Start the conversation!</p>';
      return;
    }
    STATE.chatHistory.forEach(msg => this.renderMessage(msg));
  },

  /** Handle sending a user message */
  async sendMessage(text) {
    if (!text || !text.trim()) return;

    const trimmed = text.trim();
    DOM.chatInput.value = '';

    // Add user message
    this.addMessage(trimmed, 'user');

    // Simulate bot typing delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 1200));

    // Pick a contextual or random bot reply
    const reply = this.botReplies[this.replyIndex % this.botReplies.length];
    this.replyIndex++;
    this.addMessage(reply, 'bot');
  },
};

/* ============================================================
   FILES MODULE
   ============================================================ */

const Files = {
  /** File definitions (simulated) */
  files: [
    {
      id: 'f1',
      name: 'dashboard_sample.png',
      type: 'image/png',
      size: '1.2 MB',
      src: 'dashboard_sample.png',
      previewType: 'image',
    },
    {
      id: 'f2',
      name: 'pipeline_config.yaml',
      type: 'text/yaml',
      size: '4.8 KB',
      previewType: 'text',
      content: `# Orcheeos Pipeline Configuration
name: ml-training-pipeline
version: "2.1"
stages:
  - name: data-preprocessing
    image: orcheeos/preprocess:latest
    resources:
      cpu: "2"
      memory: "4Gi"
  - name: model-training
    image: orcheeos/trainer:gpu
    resources:
      cpu: "8"
      memory: "32Gi"
      gpu: "1"
    hyperparameters:
      learning_rate: 0.001
      batch_size: 64
      epochs: 100
  - name: model-evaluation
    image: orcheeos/evaluator:latest
    depends_on: [model-training]
`,
    },
    {
      id: 'f3',
      name: 'deployment_logs.txt',
      type: 'text/plain',
      size: '28.1 KB',
      previewType: 'text',
      content: `[2025-01-15 10:32:01] INFO  Starting deployment orchestration v4.2.0
[2025-01-15 10:32:02] INFO  Validating cluster state...
[2025-01-15 10:32:03] INFO  All 12 nodes healthy, proceeding
[2025-01-15 10:32:05] INFO  Pulling image: orcheeos/api:v2.1.3
[2025-01-15 10:32:12] INFO  Image pull complete (7.2s)
[2025-01-15 10:32:13] INFO  Rolling update strategy: 25% batch size
[2025-01-15 10:32:15] INFO  Updating pod api-001... OK
[2025-01-15 10:32:18] INFO  Updating pod api-002... OK
[2025-01-15 10:32:21] INFO  Updating pod api-003... OK
[2025-01-15 10:32:24] INFO  Health checks passing for batch 1
[2025-01-15 10:32:30] INFO  Updating pod api-004... OK
[2025-01-15 10:32:33] INFO  Updating pod api-005... OK
[2025-01-15 10:32:36] INFO  Updating pod api-006... OK
[2025-01-15 10:32:39] INFO  Health checks passing for batch 2
[2025-01-15 10:32:45] INFO  All pods updated successfully
[2025-01-15 10:32:46] INFO  Deployment "orcheeos-api-v2.1.3" completed`,
    },
    {
      id: 'f4',
      name: 'system_report.pdf',
      type: 'application/pdf',
      size: '3.1 MB',
      previewType: 'image',
      src: 'dashboard_sample.png', // reuse as placeholder
    },
    {
      id: 'f5',
      name: 'metrics_dashboard.json',
      type: 'application/json',
      size: '1.7 KB',
      previewType: 'text',
      content: JSON.stringify({
        timestamp: '2025-01-15T10:35:00Z',
        metrics: {
          cpu_utilization: 62.4,
          memory_usage_gb: 18.7,
          gpu_utilization: 87.1,
          requests_per_second: 3420,
          error_rate: 0.02,
          p99_latency_ms: 245,
        },
        nodes: {
          healthy: 11,
          warning: 1,
          critical: 0,
        },
      }, null, 2),
    },
  ],

  /** Render the file list in the sidebar */
  render() {
    DOM.fileList.innerHTML = '';
    this.files.forEach(file => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `Preview ${file.name}`);

      // Icon / thumbnail
      const icon = document.createElement('img');
      icon.className = 'file-item__icon';
      icon.alt = '';
      if (file.previewType === 'image') {
        icon.src = file.src;
      } else {
        // Show a small text-icon placeholder using an inline SVG data URI
        icon.src = 'data:image/svg+xml,' + encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><rect width="36" height="36" rx="4" fill="#252540"/><text x="18" y="22" text-anchor="middle" fill="#A5A3B8" font-size="12" font-family="sans-serif">📄</text></svg>`
        );
      }

      // Info
      const info = document.createElement('div');
      info.className = 'file-item__info';

      const nameEl = document.createElement('div');
      nameEl.className = 'file-item__name';
      nameEl.textContent = file.name;

      const metaEl = document.createElement('div');
      metaEl.className = 'file-item__meta';
      metaEl.textContent = `${file.type} • ${file.size}`;

      info.appendChild(nameEl);
      info.appendChild(metaEl);

      // Actions
      const actions = document.createElement('div');
      actions.className = 'file-item__actions';

      const previewBtn = document.createElement('button');
      previewBtn.className = 'btn btn--ghost btn--icon';
      previewBtn.setAttribute('aria-label', `Preview ${file.name}`);
      previewBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      previewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Files.openPreview(file);
      });

      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'btn btn--ghost btn--icon';
      downloadBtn.setAttribute('aria-label', `Download ${file.name}`);
      downloadBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Files.downloadFile(file);
      });

      actions.appendChild(previewBtn);
      actions.appendChild(downloadBtn);

      li.appendChild(icon);
      li.appendChild(info);
      li.appendChild(actions);

      // Click on whole row opens preview
      li.addEventListener('click', () => Files.openPreview(file));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Files.openPreview(file);
        }
      });

      DOM.fileList.appendChild(li);
    });
  },

  /** Open the file preview modal */
  openPreview(file) {
    DOM.modalTitle.textContent = file.name;
    DOM.modalBody.innerHTML = '';

    if (file.previewType === 'image') {
      const img = document.createElement('img');
      img.src = file.src;
      img.alt = file.name;
      img.loading = 'lazy';
      DOM.modalBody.appendChild(img);
    } else if (file.previewType === 'text') {
      const pre = document.createElement('pre');
      pre.textContent = file.content;
      DOM.modalBody.appendChild(pre);
    }

    // Set download link
    if (file.previewType === 'image') {
      DOM.modalDownload.href = file.src;
    } else {
      const blob = new Blob([file.content], { type: file.type });
      DOM.modalDownload.href = URL.createObjectURL(blob);
    }
    DOM.modalDownload.download = file.name;

    // Show modal
    DOM.filePreviewModal.hidden = false;

    // Focus trap: move focus to modal
    DOM.modalClose.focus();
  },

  /** Download a file */
  downloadFile(file) {
    let url;
    if (file.previewType === 'image') {
      // For images, we can trigger download via fetch + blob to force download
      fetch(file.src)
        .then(res => res.blob())
        .then(blob => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(a.href);
        })
        .catch(() => {
          // Fallback: open in new tab
          window.open(file.src, '_blank');
        });
    } else {
      const blob = new Blob([file.content], { type: file.type });
      url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  },

  /** Close the preview modal */
  closePreview() {
    DOM.filePreviewModal.hidden = true;
    DOM.modalBody.innerHTML = '';
    // Revoke any blob URLs to avoid memory leaks
    if (DOM.modalDownload.href.startsWith('blob:')) {
      URL.revokeObjectURL(DOM.modalDownload.href);
    }
    DOM.modalDownload.href = '#';
  },
};

/* ============================================================
   HEALTH CHECK MODULE
   ============================================================ */

const Health = {
  /** Service definitions */
  services: [
    { id: 'api-gateway', name: 'API Gateway', detail: 'Handles incoming requests' },
    { id: 'orchestrator', name: 'Orchestrator Engine', detail: 'Workflow scheduling' },
    { id: 'gpu-cluster', name: 'GPU Cluster', detail: 'ML model training/inference' },
    { id: 'message-queue', name: 'Message Queue', detail: 'RabbitMQ / event bus' },
    { id: 'database', name: 'Database', detail: 'PostgreSQL primary' },
    { id: 'storage', name: 'Object Storage', detail: 'S3-compatible bucket' },
    { id: 'cache', name: 'Cache Layer', detail: 'Redis cluster' },
    { id: 'auth-service', name: 'Auth Service', detail: 'OAuth2 / JWT provider' },
  ],

  intervalId: null,

  /** Start periodic health checks */
  start() {
    this.update(); // Immediate first check
    this.intervalId = setInterval(() => this.update(), 5000);
  },

  /** Stop periodic health checks */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  /** Simulate health check update */
  update() {
    DOM.healthGrid.innerHTML = '';

    this.services.forEach(svc => {
      // Simulate health: mostly healthy, occasional warning, rare critical
      const rand = Math.random();
      let status, statusText;
      if (rand < 0.75) {
        status = 'healthy';
        statusText = 'OK';
      } else if (rand < 0.93) {
        status = 'warning';
        statusText = 'WARN';
      } else {
        status = 'critical';
        statusText = 'CRIT';
      }

      const item = document.createElement('div');
      item.className = `health-item health-item--${status}`;
      item.setAttribute('role', 'listitem');

      const indicator = document.createElement('span');
      indicator.className = 'health-item__indicator';
      indicator.setAttribute('aria-hidden', 'true');

      const info = document.createElement('div');
      info.className = 'health-item__info';

      const nameEl = document.createElement('span');
      nameEl.className = 'health-item__name';
      nameEl.textContent = svc.name;

      const detailEl = document.createElement('span');
      detailEl.className = 'health-item__detail';
      detailEl.textContent = svc.detail;

      info.appendChild(nameEl);
      info.appendChild(detailEl);

      const badge = document.createElement('span');
      badge.className = 'health-item__badge';
      badge.textContent = statusText;

      item.appendChild(indicator);
      item.appendChild(info);
      item.appendChild(badge);

      DOM.healthGrid.appendChild(item);
    });
  },
};

/* ============================================================
   SIDEBAR TOGGLE (Mobile)
   ============================================================ */

function initSidebar() {
  const toggle = DOM.sidebarToggle;
  const sidebar = DOM.sidebar;
  let isOpen = true; // Start open on desktop

  // On mobile, start closed
  function checkMobile() {
    return window.innerWidth < 768;
  }

  function updateSidebarState() {
    if (checkMobile()) {
      if (isOpen) {
        sidebar.classList.add('sidebar--open');
        sidebar.classList.remove('sidebar--collapsed');
      } else {
        sidebar.classList.add('sidebar--collapsed');
        sidebar.classList.remove('sidebar--open');
      }
    } else {
      // Desktop: always visible
      sidebar.classList.remove('sidebar--open', 'sidebar--collapsed');
    }
  }

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
    updateSidebarState();
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (!checkMobile()) return;
    if (!isOpen) return;
    const clickedOutside = !sidebar.contains(e.target) && !toggle.contains(e.target);
    if (clickedOutside) {
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      updateSidebarState();
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSidebarState, 150);
  });

  // Initial state
  if (checkMobile()) {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
  } else {
    toggle.setAttribute('aria-expanded', 'true');
  }
  updateSidebarState();
}

/* ============================================================
   MODAL EVENT LISTENERS
   ============================================================ */

function initModal() {
  // Close buttons
  DOM.modalClose.addEventListener('click', () => Files.closePreview());
  DOM.modalCloseBtn.addEventListener('click', () => Files.closePreview());

  // Close on overlay click
  DOM.filePreviewModal.addEventListener('click', (e) => {
    if (e.target === DOM.filePreviewModal) {
      Files.closePreview();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !DOM.filePreviewModal.hidden) {
      Files.closePreview();
    }
  });
}

/* ============================================================
   EVENT BINDING
   ============================================================ */

function bindEvents() {
  // Login form
  DOM.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = DOM.usernameInput.value;
    const password = DOM.passwordInput.value;

    if (Auth.validate(username, password)) {
      Auth.login(username, password);
    }
  });

  // Real-time validation clearing on input
  DOM.usernameInput.addEventListener('input', () => {
    DOM.usernameError.classList.remove('form-error--visible');
    DOM.usernameInput.classList.remove('input--error');
    DOM.loginGlobalError.classList.remove('form-error--visible');
  });
  DOM.passwordInput.addEventListener('input', () => {
    DOM.passwordError.classList.remove('form-error--visible');
    DOM.passwordInput.classList.remove('input--error');
    DOM.loginGlobalError.classList.remove('form-error--visible');
  });

  // Logout
  DOM.logoutBtn.addEventListener('click', () => Auth.logout());

  // Chat form
  DOM.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    Chat.sendMessage(DOM.chatInput.value);
  });
}

/* ============================================================
   INITIALIZATION
   ============================================================ */

function init() {
  bindEvents();
  initSidebar();
  initModal();
  Auth.init();
}

// Boot the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
