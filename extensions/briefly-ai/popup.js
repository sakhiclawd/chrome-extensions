document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const libraryBtn = document.getElementById('libraryBtn');
  const notionBtn = document.getElementById('notionBtn');
  const summaryBox = document.getElementById('summary');
  const readingTimeText = document.getElementById('readingTime');
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  let originalReadingTime = 0;

  // Request initial page data (like word count/reading time)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0] || !tabs[0].id) return;
    
    chrome.tabs.sendMessage(tabs[0].id, {action: "getPageInfo"}, function(response) {
      if (chrome.runtime.lastError) {
        readingTimeText.innerText = "Unable to read page.";
        return;
      }
      if (response && response.readingTime) {
        originalReadingTime = response.readingTime;
        readingTimeText.innerText = `~${originalReadingTime} min read`;
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

        if (response && response.summary && response.summary.trim().length > 0) {
          summaryBox.innerHTML = formatSummary(response.summary);
          summarizeBtn.style.display = 'none';
          libraryBtn.style.display = 'flex';
          
          // Calculate and display time saved
          const summaryWordCount = response.summary.trim().split(/\s+/).length;
          const summaryReadingTime = Math.ceil(summaryWordCount / 200) || 1;
          readingTimeText.innerHTML = `<span style="text-decoration: line-through; opacity: 0.6;">${originalReadingTime} min</span> &rarr; <strong>${summaryReadingTime} min read</strong>`;
          
        } else {
          const errMsg = response && response.error ? response.error : "API returned an empty summary.";
          summaryBox.innerText = "Error: " + errMsg;
          // Restore UI state
          loading.style.display = 'none';
          content.style.display = 'block';
        }
      });
    });
  });

  notionBtn.addEventListener('click', function() {
    // Placeholder for Notion API integration
    alert("Notion export logic would go here. Configure your Notion Token in options.");
  });
});

function formatSummary(text) {
  // Simple markdown-ish to HTML converter
  return text
    .replace(/###\s*(.*?)(?:\n|$)/g, '<strong>$1</strong><br>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[\s]*[\*\-]\s*(.*?)(?:\n|$)/gm, '&bull; $1<br>')
    .replace(/<br>[\s]*[\*\-]\s*(.*?)(?:<br>|$)/g, '<br>&bull; $1<br>');
}