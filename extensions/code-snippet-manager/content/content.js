/**
 * Code Snippet Manager - Content Script
 * Handles page interactions and code detection
 */

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'get-selection') {
    // Try to get selected code
    const selection = window.getSelection().toString();
    sendResponse({ selection });
  }
  return true;
});

// Detect code blocks on page (optional enhancement)
function detectCodeBlocks() {
  const codeElements = document.querySelectorAll('pre code, pre, code');
  return Array.from(codeElements).map(el => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent.trim().substring(0, 100)
  }));
}

// Optional: Add hover indicator for detected code blocks
function addCodeHighlights() {
  const codeBlocks = document.querySelectorAll('pre, code');
  codeBlocks.forEach(block => {
    block.addEventListener('mouseenter', () => {
      block.style.outline = '2px solid #e94560';
    });
    block.addEventListener('mouseleave', () => {
      block.style.outline = 'none';
    });
  });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addCodeHighlights);
} else {
  addCodeHighlights();
}