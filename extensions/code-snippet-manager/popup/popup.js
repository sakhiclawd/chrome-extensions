/**
 * Code Snippet Manager - Popup Script
 * Handles UI interactions and snippet management
 */

// === State ===
let snippets = [];
let filteredSnippets = [];
let editingId = null;
let searchQuery = '';
let languageFilter = '';
let sortOrder = 'date-desc';

// === DOM Elements ===
const elements = {
  snippetList: document.getElementById('snippet-list'),
  emptyState: document.getElementById('empty-state'),
  noResults: document.getElementById('no-results'),
  searchInput: document.getElementById('search-input'),
  languageFilter: document.getElementById('language-filter'),
  sortFilter: document.getElementById('sort-filter'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalTitle: document.getElementById('modal-title'),
  snippetForm: document.getElementById('snippet-form'),
  snippetTitle: document.getElementById('snippet-title'),
  snippetLanguage: document.getElementById('snippet-language'),
  snippetTags: document.getElementById('snippet-tags'),
  snippetCode: document.getElementById('snippet-code'),
  toastContainer: document.getElementById('toast-container'),
  btnAdd: document.getElementById('btn-add'),
  btnExport: document.getElementById('btn-export'),
  btnCloseModal: document.getElementById('btn-close-modal'),
  btnCancel: document.getElementById('btn-cancel'),
  btnEmptyAdd: document.getElementById('btn-empty-add')
};

// === Storage Utils ===
const storage = {
  async getSnippets() {
    const data = await chrome.storage.sync.get('snippets');
    return data.snippets || [];
  },

  async saveSnippets(snippets) {
    await chrome.storage.sync.set({ snippets });
  },

  async addSnippet(snippet) {
    const snippets = await this.getSnippets();
    snippets.unshift(snippet);
    await this.saveSnippets(snippets);
    return snippet;
  },

  async updateSnippet(id, updates) {
    const snippets = await this.getSnippets();
    const index = snippets.findIndex(s => s.id === id);
    if (index !== -1) {
      snippets[index] = { ...snippets[index], ...updates, updatedAt: Date.now() };
      await this.saveSnippets(snippets);
      return snippets[index];
    }
    return null;
  },

  async deleteSnippet(id) {
    const snippets = await this.getSnippets();
    const filtered = snippets.filter(s => s.id !== id);
    await this.saveSnippets(filtered);
  },

  async exportData() {
    const snippets = await this.getSnippets();
    const data = JSON.stringify({ snippets, exportedAt: Date.now() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippets-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// === Snippet Generation ===
function generateId() {
  return 'snippet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function detectLanguage(code) {
  const patterns = {
    javascript: [/\bfunction\b/, /\bconst\b/, /\blet\b/, /\bvar\b/, /\b=>\b/, /\bconsole\./, /\bdocument\./, /\bwindow\./],
    python: [/\bdef\b/, /\bimport\b/, /\bfrom\b/, /\bprint\b/, /\bself\b/, /\b__init__\b/, /\belif\b/],
    html: [/<html/, /<div/, /<span/, /<p>/, /<\/[a-z]+>/, /<!DOCTYPE/i],
    css: [/\b\{[\s\S]*:\s*[\dpx%]+/, /\.class\b/, /#id\b/, /@media/],
    typescript: [/\binterface\b/, /\btype\b/, /:\s*(string|number|boolean|any)\b/, /<[A-Z]\w*>/],
    java: [/\bpublic\b/, /\bprivate\b/, /\bclass\b/, /\bSystem\.out\b/, /\bvoid\b/],
    cpp: [/\b#include\b/, /\bstd::/, /\bcout\b/, /\bint main\b/],
    go: [/\bpackage\b/, /\bfunc\b/, /\bfmt\./, /\bgo\b/],
    rust: [/\bfn\b/, /\blet\s+mut\b/, /\bimpl\b/, /\bpub\b/, /\buse\b/],
    sql: [/\bSELECT\b/i, /\bFROM\b/i, /\bWHERE\b/i, /\bINSERT\b/i, /\bUPDATE\b/i],
    shell: [/^#!/, /\becho\b/, /\bexport\b/, /\bsudo\b/, /\bchmod\b/]
  };

  for (const [lang, regexes] of Object.entries(patterns)) {
    if (regexes.some(regex => regex.test(code))) {
      return lang;
    }
  }
  return 'other';
}

function createSnippetObject(data) {
  const now = Date.now();
  return {
    id: generateId(),
    title: data.title.trim(),
    code: data.code,
    language: data.language,
    tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    starred: false,
    createdAt: now,
    updatedAt: now,
    usageCount: 0
  };
}

// === Filtering & Sorting ===
function filterAndSortSnippets() {
  let result = [...snippets];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  // Language filter
  if (languageFilter) {
    result = result.filter(s => s.language === languageFilter);
  }

  // Sort
  result.sort((a, b) => {
    switch (sortOrder) {
      case 'date-desc':
        return b.createdAt - a.createdAt;
      case 'date-asc':
        return a.createdAt - b.createdAt;
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  filteredSnippets = result;
}

// === Rendering ===
function truncateCode(code, maxLines = 3) {
  const lines = code.split('\n');
  if (lines.length <= maxLines) return code;
  return lines.slice(0, maxLines).join('\n') + '\n...';
}

function renderSnippetCard(snippet) {
  const card = document.createElement('div');
  card.className = 'snippet-card';
  card.dataset.id = snippet.id;

  const previewCode = truncateCode(snippet.code);
  const tagsHtml = snippet.tags.length
    ? snippet.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')
    : '';

  card.innerHTML = `
    <div class="snippet-card-header">
      <div class="snippet-title-row">
        <span class="snippet-title">${escapeHtml(snippet.title)}</span>
        <span class="snippet-star ${snippet.starred ? 'starred' : ''}" data-action="star">★</span>
      </div>
      <div class="snippet-actions">
        <button class="snippet-action-btn copy-btn" data-action="copy" title="Copy">Copy</button>
        <button class="snippet-action-btn" data-action="edit" title="Edit">Edit</button>
        <button class="snippet-action-btn delete-btn" data-action="delete" title="Delete">Del</button>
      </div>
    </div>
    <div class="snippet-meta">
      <span class="language-badge">${snippet.language}</span>
      <div class="tags-list">${tagsHtml}</div>
    </div>
    <div class="snippet-preview">${escapeHtml(previewCode)}</div>
  `;

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderSnippetList() {
  elements.snippetList.innerHTML = '';

  if (filteredSnippets.length === 0) {
    if (snippets.length === 0) {
      elements.emptyState.style.display = 'flex';
      elements.noResults.style.display = 'none';
    } else {
      elements.emptyState.style.display = 'none';
      elements.noResults.style.display = 'flex';
    }
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.noResults.style.display = 'none';

  filteredSnippets.forEach(snippet => {
    elements.snippetList.appendChild(renderSnippetCard(snippet));
  });
}

function updateUI() {
  filterAndSortSnippets();
  renderSnippetList();
}

// === Modal ===
function openModal(editSnippet = null) {
  editingId = editSnippet ? editSnippet.id : null;
  elements.modalTitle.textContent = editSnippet ? 'Edit Snippet' : 'Add Snippet';

  if (editSnippet) {
    elements.snippetTitle.value = editSnippet.title;
    elements.snippetLanguage.value = editSnippet.language;
    elements.snippetTags.value = editSnippet.tags.join(', ');
    elements.snippetCode.value = editSnippet.code;
  } else {
    elements.snippetForm.reset();
  }

  elements.modalOverlay.classList.add('active');
  elements.snippetTitle.focus();
}

function closeModal() {
  elements.modalOverlay.classList.remove('active');
  editingId = null;
  elements.snippetForm.reset();
}

// === Toast Notifications ===
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close">&times;</button>
  `;

  elements.toastContainer.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  setTimeout(() => removeToast(toast), 3000);
}

function removeToast(toast) {
  toast.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => toast.remove(), 300);
}

// === Event Handlers ===
async function handleAddSnippet(e) {
  e.preventDefault();

  const data = {
    title: elements.snippetTitle.value,
    language: elements.snippetLanguage.value,
    tags: elements.snippetTags.value,
    code: elements.snippetCode.value
  };

  // Auto-detect language if "other" selected but code suggests otherwise
  if (data.language === 'other') {
    const detected = detectLanguage(data.code);
    if (detected !== 'other') {
      data.language = detected;
    }
  }

  if (editingId) {
    await storage.updateSnippet(editingId, data);
    showToast('Snippet updated successfully');
  } else {
    const snippet = createSnippetObject(data);
    await storage.addSnippet(snippet);
    showToast('Snippet saved successfully');
  }

  snippets = await storage.getSnippets();
  closeModal();
  updateUI();
}

async function handleCopySnippet(code, id) {
  try {
    await navigator.clipboard.writeText(code);
    await storage.updateSnippet(id, { usageCount: (snippets.find(s => s.id === id)?.usageCount || 0) + 1 });
    showToast('Copied to clipboard');
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
}

async function handleDeleteSnippet(id) {
  if (confirm('Are you sure you want to delete this snippet?')) {
    await storage.deleteSnippet(id);
    snippets = await storage.getSnippets();
    showToast('Snippet deleted');
    updateUI();
  }
}

async function handleToggleStar(id) {
  const snippet = snippets.find(s => s.id === id);
  if (snippet) {
    await storage.updateSnippet(id, { starred: !snippet.starred });
    snippets = await storage.getSnippets();
    updateUI();
  }
}

function handleSnippetAction(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const card = btn.closest('.snippet-card');
  const id = card?.dataset.id;
  const snippet = snippets.find(s => s.id === id);

  switch (action) {
    case 'copy':
      handleCopySnippet(snippet.code, id);
      break;
    case 'edit':
      openModal(snippet);
      break;
    case 'delete':
      handleDeleteSnippet(id);
      break;
    case 'star':
      handleToggleStar(id);
      break;
  }
}

// === Keyboard Shortcuts ===
function handleKeydown(e) {
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    elements.searchInput.focus();
  }
}

// === Initialize ===
async function init() {
  // Load snippets
  snippets = await storage.getSnippets();
  updateUI();

  // Event listeners
  elements.btnAdd.addEventListener('click', () => openModal());
  elements.btnEmptyAdd.addEventListener('click', () => openModal());
  elements.btnCloseModal.addEventListener('click', closeModal);
  elements.btnCancel.addEventListener('click', closeModal);
  elements.btnExport.addEventListener('click', async () => {
    await storage.exportData();
    showToast('Data exported successfully');
  });

  elements.snippetForm.addEventListener('submit', handleAddSnippet);
  elements.snippetList.addEventListener('click', handleSnippetAction);

  elements.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    updateUI();
  });

  elements.languageFilter.addEventListener('change', (e) => {
    languageFilter = e.target.value;
    updateUI();
  });

  elements.sortFilter.addEventListener('change', (e) => {
    sortOrder = e.target.value;
    updateUI();
  });

  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', handleKeydown);

  // Listen for messages from background script (context menu)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'new-snippet') {
      openModal({
        id: null,
        title: '',
        language: detectLanguage(message.code),
        tags: '',
        code: message.code
      });
      elements.snippetTitle.focus();
    }
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);