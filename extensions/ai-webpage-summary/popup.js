document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summaryBox = document.getElementById('summary');
  const readingTimeText = document.getElementById('readingTime');
  const pageTitleText = document.getElementById('pageTitle');
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  const summaryContainer = document.getElementById('summaryContainer');
  const libraryLinkArea = document.getElementById('libraryLinkArea');

  // Request initial page data
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0].title) {
      pageTitleText.innerText = tabs[0].title;
    }
    
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
        loading.style.display = 'none';
        content.style.display = 'block';

        if (response && response.summary) {
          summaryContainer.style.display = 'block';
          summaryBox.innerHTML = formatSummary(response.summary);
          summarizeBtn.style.display = 'none';
          
          if (response.libraryUrl) {
            libraryLinkArea.innerHTML = `
              <a href="${response.libraryUrl}" target="_blank" class="library-link">
                📖 View in your PM Library
              </a>`;
          }
        } else {
          summaryContainer.style.display = 'block';
          const errMsg = response && response.error ? response.error : "Could not generate summary.";
          summaryBox.innerText = "Error: " + errMsg;
        }
      });
    });
  });
});

function formatSummary(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\* (.*?)(?:<br>|$)/g, '• $1<br>');
}
