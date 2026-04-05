/**
 * Code Snippet Manager - Background Service Worker
 * Handles context menus and keyboard commands
 */

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  // Main context menu
  chrome.contextMenus.create({
    id: 'save-to-snippets',
    title: 'Save to Code Snippets',
    contexts: ['selection', 'page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-snippets') {
    let code = '';
    
    // Get selected text or page content
    if (info.selectionText) {
      code = info.selectionText;
    } else {
      // Try to get code from page via content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'get-selection' });
        code = response?.selection || '';
      } catch (e) {
        console.error('Failed to get selection:', e);
      }
    }

    if (code) {
      // Send to popup
      chrome.runtime.sendMessage({
        type: 'new-snippet',
        code: code
      }).catch(() => {
        // Popup might not be open, store for later
        chrome.storage.local.set({ pendingSnippet: code });
      });
    }
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-popup') {
    // Focus or reopen popup
    chrome.action.openPopup();
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-pending-snippet') {
    chrome.storage.local.get('pendingSnippet').then(data => {
      sendResponse({ code: data.pendingSnippet || null });
      chrome.storage.local.remove('pendingSnippet');
    });
    return true;
  }
});

// Initialize on startup
chrome.runtime.onStartup.addListener(() => {
  // Recreate context menu if needed
  chrome.contextMenus.create({
    id: 'save-to-snippets',
    title: 'Save to Code Snippets',
    contexts: ['selection', 'page']
  });
});