// AI Webpage Summary - Background Script
// Handles API calls to pmdirectory.net backend

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAI") {
    generateSummary(request.text, request.title, request.url)
      .then(data => sendResponse(data))
      .catch(error => {
        console.error('Extension Background Error:', error);
        sendResponse({ error: "Failed to generate summary. Please check if the pmdirectory.net backend is active." });
      });
    return true; // async
  }
});

async function generateSummary(text, title, url) {
  // Use anonymousId to track uniqueness without accounts
  let { anonymousId } = await chrome.storage.local.get('anonymousId');
  if (!anonymousId) {
    anonymousId = 'anon_' + Math.random().toString(36).substring(2, 15);
    await chrome.storage.local.set({ anonymousId });
  }

  const API_URL = "https://pmdirectory.net/api/summarize";
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      title,
      text: text.substring(0, 15000), // Protect payload size
      anonymousId
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
