document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const shareBtn = document.getElementById('shareBtn');
  const summaryBox = document.getElementById('summary');
  const readingTimeText = document.getElementById('readingTime');
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  const statusLink = document.getElementById('statusLink');

  let currentLibraryUrl = '';

  // Request initial page data
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getPageInfo"}, function(response) {
      if (response && response.readingTime) {
        readingTimeText.innerText = `⏱️ ~${response.readingTime} min read`;
      }
    });
  });

  summarizeBtn.addEventListener('click', function() {
    loading.style.display = 'block';
    content.style.display = 'none';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "summarize"}, function(response) {
        if (response && response.summary) {
          loading.style.display = 'none';
          content.style.display = 'block';
          summaryBox.innerHTML = formatSummary(response.summary);
          summarizeBtn.style.display = 'none';
          shareBtn.style.display = 'flex';
          
          if (response.libraryUrl) {
            currentLibraryUrl = response.libraryUrl;
            statusLink.innerHTML = `<a href="${currentLibraryUrl}" target="_blank">View in Community Library ↗</a>`;
          }
        } else {
          loading.style.display = 'none';
          content.style.display = 'block';
          summaryBox.innerText = response.error || "Error: Could not generate summary.";
        }
      });
    });
  });

  shareBtn.addEventListener('click', function() {
    if (currentLibraryUrl) {
      navigator.clipboard.writeText(currentLibraryUrl).then(() => {
        const originalText = shareBtn.innerText;
        shareBtn.innerText = '✅ Link Copied!';
        setTimeout(() => { shareBtn.innerText = originalText; }, 2000);
      });
    }
  });
});

function formatSummary(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\* (.*?)(?:<br>|$)/g, '• $1<br>');
}
