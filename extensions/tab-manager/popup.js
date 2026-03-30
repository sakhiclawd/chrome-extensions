/**
 * Tab Manager - popup.js
 * Senior Engineer Implementation
 */

// --- Constants & State ---
const STORAGE_KEY_SESSIONS = 'saved_sessions';
let allTabs = [];
let groupedByDomain = false;

// --- DOM Elements ---
const searchInput = document.getElementById('search-input');
const btnGroup = document.getElementById('btn-group');
const btnSaveSession = document.getElementById('btn-save-session');
const tabContainer = document.getElementById('tab-container');
const sessionsList = document.getElementById('sessions-list');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  refreshTabs();
  loadSavedSessions();

  // --- Event Listeners ---
  searchInput.addEventListener('input', renderTabs);

  btnGroup.addEventListener('click', () => {
    groupedByDomain = !groupedByDomain;
    btnGroup.classList.toggle('active', groupedByDomain);
    renderTabs();
  });

  btnSaveSession.addEventListener('click', saveCurrentSession);
});

// --- Tab Management ---

async function refreshTabs() {
  allTabs = await chrome.tabs.query({ currentWindow: true });
  renderTabs();
}

function renderTabs() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  let filteredTabs = allTabs.filter(tab => 
    tab.title.toLowerCase().includes(searchTerm) || 
    tab.url.toLowerCase().includes(searchTerm)
  );

  tabContainer.innerHTML = '';

  if (filteredTabs.length === 0) {
    tabContainer.innerHTML = '<div class="empty-state">No matching tabs found.</div>';
    return;
  }

  if (groupedByDomain && !searchTerm) {
    renderGroupedTabs(filteredTabs);
  } else {
    const list = document.createElement('ul');
    list.className = 'tab-list';
    filteredTabs.forEach(tab => {
      list.appendChild(createTabItem(tab));
    });
    tabContainer.appendChild(list);
  }
}

function renderGroupedTabs(tabs) {
  const groups = {};
  tabs.forEach(tab => {
    try {
      const domain = new URL(tab.url).hostname || 'other';
      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(tab);
    } catch (e) {
      if (!groups['other']) groups['other'] = [];
      groups['other'].push(tab);
    }
  });

  Object.keys(groups).sort().forEach(domain => {
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header';
    groupHeader.textContent = domain;
    tabContainer.appendChild(groupHeader);

    const list = document.createElement('ul');
    list.className = 'tab-list';
    groups[domain].forEach(tab => {
      list.appendChild(createTabItem(tab));
    });
    tabContainer.appendChild(list);
  });
}

function createTabItem(tab) {
  const isSuspended = tab.url.startsWith('chrome-extension://') && tab.url.includes('suspended.html');
  const li = document.createElement('li');
  li.className = `tab-item ${isSuspended ? 'suspended' : ''}`;
  
  // Try to parse real URL if suspended
  let displayUrl = tab.url;
  let displayTitle = tab.title;
  if (isSuspended) {
    const params = new URLSearchParams(new URL(tab.url).search);
    displayUrl = params.get('url') || tab.url;
    displayTitle = params.get('title') || tab.title;
  }

  li.innerHTML = `
    <img class="favicon" src="${tab.favIconUrl || 'icons/icon16.png'}" onerror="this.src='icons/icon16.png'">
    <div class="tab-info">
      <span class="tab-title" title="${displayTitle}">${displayTitle}</span>
      <span class="tab-url" title="${displayUrl}">${displayUrl}</span>
    </div>
    <div class="tab-actions">
      <button class="btn-icon btn-suspend" title="${isSuspended ? 'Resume Tab' : 'Suspend Tab'}">
        ${isSuspended ? 'Resume' : 'Suspend'}
      </button>
      <button class="btn-icon btn-danger btn-close" title="Close Tab">Close</button>
    </div>
  `;

  li.addEventListener('click', (e) => {
    if (e.target.closest('.tab-actions')) return;
    chrome.tabs.update(tab.id, { active: true });
  });

  li.querySelector('.btn-suspend').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSuspend(tab, isSuspended);
  });

  li.querySelector('.btn-close').addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.tabs.remove(tab.id, () => refreshTabs());
  });

  return li;
}

async function toggleSuspend(tab, currentlySuspended) {
  if (currentlySuspended) {
    const params = new URLSearchParams(new URL(tab.url).search);
    const realUrl = params.get('url');
    if (realUrl) {
      await chrome.tabs.update(tab.id, { url: realUrl });
    }
  } else {
    // For now, we point to a simple placeholder or just a data URL if file doesn't exist
    // Proper implementation requires suspended.html in the extension
    const suspendUrl = chrome.runtime.getURL(`suspended.html?url=${encodeURIComponent(tab.url)}&title=${encodeURIComponent(tab.title)}`);
    await chrome.tabs.update(tab.id, { url: suspendUrl });
  }
  refreshTabs();
}

// --- Session Management ---

async function saveCurrentSession() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  if (tabs.length === 0) return;

  const sessionName = `Session ${new Date().toLocaleString()}`;
  const sessionData = {
    id: Date.now(),
    name: sessionName,
    urls: tabs.map(t => t.url),
    timestamp: new Date().toISOString()
  };

  const result = await chrome.storage.local.get(STORAGE_KEY_SESSIONS);
  const sessions = result[STORAGE_KEY_SESSIONS] || [];
  sessions.unshift(sessionData);

  await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: sessions });
  showToast('Session saved!');
  loadSavedSessions();
}

async function loadSavedSessions() {
  const result = await chrome.storage.local.get(STORAGE_KEY_SESSIONS);
  const sessions = result[STORAGE_KEY_SESSIONS] || [];
  
  sessionsList.innerHTML = '';
  if (sessions.length === 0) {
    sessionsList.innerHTML = '<li class="empty-state">No saved sessions.</li>';
    return;
  }

  sessions.forEach(session => {
    const li = document.createElement('li');
    li.className = 'session-item';
    li.innerHTML = `
      <div class="session-info">
        <span class="session-name" title="${session.name}">${session.name}</span>
        <span class="session-count">${session.urls.length} tabs</span>
      </div>
      <div class="session-actions">
        <button class="btn-icon btn-restore">Restore</button>
        <button class="btn-icon btn-danger btn-delete">Delete</button>
      </div>
    `;

    li.querySelector('.btn-restore').addEventListener('click', () => restoreSession(session));
    li.querySelector('.btn-delete').addEventListener('click', () => deleteSession(session.id));
    
    sessionsList.appendChild(li);
  });
}

async function restoreSession(session) {
  for (const url of session.urls) {
    await chrome.tabs.create({ url, active: false });
  }
  showToast('Session restored!');
  refreshTabs();
}

async function deleteSession(id) {
  const result = await chrome.storage.local.get(STORAGE_KEY_SESSIONS);
  let sessions = result[STORAGE_KEY_SESSIONS] || [];
  sessions = sessions.filter(s => s.id !== id);
  await chrome.storage.local.set({ [STORAGE_KEY_SESSIONS]: sessions });
  loadSavedSessions();
}

// --- Helpers ---

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
