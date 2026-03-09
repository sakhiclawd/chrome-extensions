document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const notionBtn = document.getElementById('notionBtn');
  const summaryBox = document.getElementById('summary');
  const readingTimeText = document.getElementById('readingTime');
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  // Request initial page data (like word count/reading time)
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
        loading.style.display = 'none';
        content.style.display = 'block';

        if (response && response.summary) {
          summaryBox.innerHTML = formatSummary(response.summary);
          summarizeBtn.style.display = 'none';
          notionBtn.style.display = 'flex';
        } else {
          summaryBox.innerText = "Error: Could not generate summary. Check your connection or API key.";
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
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\* (.*?)(?:<br>|$)/g, '• $1<br>');
}