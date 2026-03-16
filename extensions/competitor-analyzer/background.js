// Competitor Analyzer - Background Script
// Handles communication with PMLibrary API

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchMetrics") {
    fetchMetrics(request.domain)
      .then(metrics => sendResponse({ metrics }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // async
  }
});

async function fetchMetrics(domain) {
  const API_URL = `https://www.pmdirectory.net/api/competitor-stats?domain=${domain}`;
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}
