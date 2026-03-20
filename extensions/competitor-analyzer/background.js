// Briefly Analyzer - Background Script
// Handles communication with PMLibrary API

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchMetrics") {
    fetchMetrics(request.domain)
      .then(metrics => sendResponse({ success: true, metrics }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // async
  }

  if (request.action === "saveSnapshot") {
    saveSnapshot(request.data)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // async
  }
});

async function fetchMetrics(domain) {
  // In production, this hits the real SEO data proxy
  // Mocking for beta implementation based on spec
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: {
          status: "Strong",
          category: "Technology / SaaS"
        },
        traffic: {
          monthlyVisits: "250K+",
          avgDuration: "3m 12s",
          bounceRate: "41.2%"
        },
        seo: {
          keywordCount: "4.2K",
          estMonthlyCost: "$15.8K"
        },
        backlinks: {
          totalBacklinks: "12.5K",
          refDomains: "1.1K"
        }
      });
    }, 800);
  });
}

async function saveSnapshot(data) {
  const API_URL = "https://www.pmdirectory.net/api/competitor-reports";
  
  // Tagging with type for isolation from Briefly AI
  const payload = {
    ...data,
    type: 'competitor_analysis',
    timestamp: new Date().toISOString()
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}
