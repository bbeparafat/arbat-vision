(() => {
  'use strict';

  const pageNames = {
    overview: 'Overview', assistant: 'AI Assistant', memory: 'Memory',
    tools: 'Skills & tools', projects: 'Projects', activity: 'Activity', settings: 'Settings'
  };
  const navButtons = [...document.querySelectorAll('.nav-item')];
  const pages = [...document.querySelectorAll('[data-page-content]')];
  const crumb = document.getElementById('pageCrumb');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
  }

  function setPage(name) {
    if (!pageNames[name]) return;
    pages.forEach(page => {
      const active = page.dataset.pageContent === name;
      page.classList.toggle('is-active', active);
      page.hidden = !active;
    });
    navButtons.forEach(button => {
      const active = button.dataset.page === name;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    crumb.textContent = pageNames[name];
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
  }
  function openSidebar() {
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-visible');
  }

  navButtons.forEach(button => button.addEventListener('click', () => setPage(button.dataset.page)));
  document.querySelectorAll('[data-page]').forEach(button => {
    if (!button.classList.contains('nav-item')) button.addEventListener('click', () => setPage(button.dataset.page));
  });
  document.querySelectorAll('[data-open-page]').forEach(button => button.addEventListener('click', () => setPage(button.dataset.openPage)));
  document.getElementById('menuButton').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  backdrop.addEventListener('click', closeSidebar);

  // Search modal: keyboard shortcut, page filtering, and keyboard navigation.
  const searchOverlay = document.getElementById('searchOverlay');
  const globalSearch = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  const pageIcons = {
    overview: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    assistant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-3.5 2v-5A7.5 7.5 0 1 1 20 11.5Z"/></svg>',
    memory: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12A2.5 2.5 0 0 1 20.5 7v12.5H8A3.5 3.5 0 0 1 4.5 16V6A1.5 1.5 0 0 1 6 4.5Z"/></svg>',
    tools: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6.5 17.5 3 21 6.5l-3.5 3.5M13 8l3 3-8.5 8.5a2.12 2.12 0 0 1-3-3L13 8Z"/></svg>',
    projects: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h6l2 2h8A1.5 1.5 0 0 1 21.5 11v7A2.5 2.5 0 0 1 19 20.5H5A2.5 2.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z"/></svg>',
    activity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2.2-6 4.2 12 2.2-6H21"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.3 1-1.4 2.4-1.6-.6a8 8 0 0 1-1.6.9l-.3 1.7h-2.8l-.3-1.7a8 8 0 0 1-1.6-.9l-1.6.6-1.4-2.4 1.3-1a7 7 0 0 1 0-1.8l-1.3-1 1.4-2.4 1.6.6a8 8 0 0 1 1.6-.9l.3-1.7h2.8l.3 1.7a8 8 0 0 1 1.6.9l1.6-.6 1.4 2.4-1.3 1a7 7 0 0 1 0 1.8Z"/></svg>'
  };
  const searchablePages = Object.entries(pageNames).map(([key, title]) => ({ key, title }));

  function renderSearch(query = '') {
    const normalized = query.trim().toLowerCase();
    const matches = searchablePages.filter(item => item.title.toLowerCase().includes(normalized) || item.key.includes(normalized));
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-hint';
      empty.textContent = 'No matching pages';
      searchResults.append(empty);
      return;
    }
    matches.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'search-result';
      button.type = 'button';
      button.innerHTML = `${pageIcons[item.key]}<span></span><kbd>${index + 1}</kbd>`;
      button.querySelector('span').textContent = item.title;
      button.addEventListener('click', () => {
        setPage(item.key);
        closeSearch();
      });
      searchResults.append(button);
    });
  }
  function openSearch() {
    searchOverlay.hidden = false;
    renderSearch('');
    globalSearch.value = '';
    requestAnimationFrame(() => globalSearch.focus());
  }
  function closeSearch() {
    searchOverlay.hidden = true;
    document.getElementById('searchButton').focus();
  }
  document.getElementById('searchButton').addEventListener('click', openSearch);
  document.getElementById('searchScrim').addEventListener('click', closeSearch);
  globalSearch.addEventListener('input', () => renderSearch(globalSearch.value));
  globalSearch.addEventListener('keydown', event => {
    if (event.key === 'Enter') searchResults.querySelector('.search-result')?.click();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      searchResults.querySelector('.search-result')?.focus();
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      if (!searchOverlay.hidden) closeSearch();
      closeSidebar();
    }
    if ((event.metaKey || event.ctrlKey) && /^[1-5]$/.test(event.key) && !searchOverlay.hidden) {
      const item = searchablePages[Number(event.key) - 1];
      if (item) { setPage(item.key); closeSearch(); }
    }
  });
  document.getElementById('noticeButton').addEventListener('click', () => showToast('ARBAT Core is in prototype mode.'));

  // Chat prototype: be explicit that no model is connected, never fabricate an answer.
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  function addMessage(text, type) {
    const bubble = document.createElement('div');
    bubble.className = type === 'user' ? 'message-user' : 'message-system';
    if (type === 'system') {
      const title = document.createElement('strong');
      title.textContent = 'ARBAT Core is not connected';
      bubble.append(title);
    }
    bubble.append(document.createTextNode(text));
    chatMessages.append(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    addMessage('এখনো কোনো AI model যুক্ত নেই, তাই এই prototype উত্তর তৈরি করতে পারবে না। Settings-এ architecture ও secure setup notes দেখো।', 'system');
    chatInput.value = '';
    logActivity('Tried the AI Assistant', 'Chat prototype · Model not connected');
  });
  document.querySelectorAll('.suggestion-chip').forEach(button => button.addEventListener('click', () => {
    chatInput.value = button.textContent.trim();
    chatInput.focus();
  }));
  document.getElementById('newChatButton').addEventListener('click', () => {
    chatMessages.replaceChildren();
    const welcome = document.createElement('div');
    welcome.className = 'welcome-message';
    welcome.innerHTML = '<span class="welcome-glyph">✳</span><p class="eyebrow">A PERSONAL AI, BUILT AROUND YOU</p><h2>নতুন করে শুরু করি।</h2><p>তোমার ARBAT-এর vision নিয়ে কথা বলো, অথবা নিচের কোনো topic বেছে নাও।</p>';
    chatMessages.append(welcome);
    showToast('New conversation started.');
  });

  // Local notes and session-only activity log.
  const NOTE_KEY = 'arbat_redesign_notes_v1';
  let notes = [];
  try {
    const stored = JSON.parse(localStorage.getItem(NOTE_KEY) || '[]');
    if (Array.isArray(stored)) notes = stored.filter(item => item && typeof item.text === 'string');
  } catch { notes = []; }
  const noteForm = document.getElementById('noteForm');
  const noteInput = document.getElementById('noteInput');
  const memoryList = document.getElementById('memoryList');
  const memoryEmpty = document.getElementById('memoryEmpty');
  const memorySearch = document.getElementById('memorySearch');
  let activity = [];

  function renderNotes() {
    const query = memorySearch.value.trim().toLowerCase();
    const visible = notes.map((note, index) => ({ ...note, index })).filter(note => note.text.toLowerCase().includes(query));
    memoryList.replaceChildren();
    document.getElementById('memoryCount').textContent = String(notes.length).padStart(2, '0');
    document.getElementById('memoryListCount').textContent = String(notes.length);
    memoryEmpty.hidden = visible.length > 0;
    if (notes.length > 0 && visible.length === 0) {
      memoryEmpty.hidden = false;
      memoryEmpty.querySelector('h3').textContent = 'No matching notes';
      memoryEmpty.querySelector('p').textContent = 'Try another search term.';
    } else if (notes.length === 0) {
      memoryEmpty.querySelector('h3').textContent = 'No notes yet';
      memoryEmpty.querySelector('p').textContent = 'তোমার প্রথম idea বা project note এখানে save করো।';
    }
    visible.forEach(note => {
      const article = document.createElement('article');
      article.className = 'note-card';
      const top = document.createElement('div');
      top.className = 'note-card-top';
      const text = document.createElement('p');
      text.textContent = note.text;
      const remove = document.createElement('button');
      remove.className = 'delete-note';
      remove.type = 'button';
      remove.textContent = 'Delete';
      remove.setAttribute('aria-label', 'Delete note');
      remove.addEventListener('click', () => {
        if (!window.confirm('Delete this note from this browser?')) return;
        notes.splice(note.index, 1);
        persistNotes();
        logActivity('Deleted a memory note', 'Local note removed from this device');
      });
      top.append(text, remove);
      const meta = document.createElement('div');
      meta.className = 'note-meta';
      meta.textContent = `Saved ${note.date || 'recently'} · This device`;
      article.append(top, meta);
      memoryList.append(article);
    });
  }
  function persistNotes() {
    try { localStorage.setItem(NOTE_KEY, JSON.stringify(notes)); }
    catch { showToast('Could not save. Browser storage may be full.'); }
    renderNotes();
  }
  noteForm.addEventListener('submit', event => {
    event.preventDefault();
    const text = noteInput.value.trim();
    if (!text) return;
    notes.unshift({ text, date: new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date()) });
    noteInput.value = '';
    persistNotes();
    logActivity('Saved a memory note', text.length > 58 ? `${text.slice(0, 58)}…` : text);
    showToast('Note saved on this device.');
  });
  memorySearch.addEventListener('input', renderNotes);

  function logActivity(title, detail) {
    activity.unshift({ title, detail, time: new Date() });
    activity = activity.slice(0, 8);
    renderActivity();
  }
  function renderActivity() {
    const list = document.getElementById('activityList');
    const empty = document.getElementById('activityEmpty');
    list.replaceChildren();
    empty.hidden = activity.length > 0;
    activity.forEach(item => {
      const row = document.createElement('div');
      row.className = 'activity-row';
      const bullet = document.createElement('span');
      bullet.className = 'activity-bullet';
      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.title;
      const subtitle = document.createElement('small');
      subtitle.textContent = item.detail;
      details.append(title, subtitle);
      const time = document.createElement('time');
      time.dateTime = item.time.toISOString();
      time.textContent = item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      row.append(bullet, details, time);
      list.append(row);
    });
  }

  // Theme setting is local to this browser.
  const themeToggle = document.getElementById('themeToggle');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('arbat_redesign_theme'); } catch { /* Storage can be unavailable in restricted browser contexts. */ }
  if (savedTheme === 'dark') {
    document.body.dataset.theme = 'dark';
    themeToggle.setAttribute('aria-checked', 'true');
  }
  themeToggle.addEventListener('click', () => {
    const dark = document.body.dataset.theme !== 'dark';
    document.body.dataset.theme = dark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-checked', String(dark));
    try { localStorage.setItem('arbat_redesign_theme', dark ? 'dark' : 'light'); } catch { /* Keep the theme for this session if storage is blocked. */ }
    showToast(dark ? 'Dark mode enabled.' : 'Light mode enabled.');
  });
  document.getElementById('modelInfoButton').addEventListener('click', () => {
    setPage('projects');
  });

  renderNotes();
  renderActivity();
  const requestedPage = new URLSearchParams(window.location.search).get('page');
  if (requestedPage && pageNames[requestedPage]) setPage(requestedPage);
})();
