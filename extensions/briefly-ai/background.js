// AI Webpage Summary - Background Script
// Handles API calls to bypass CORS and manage global state

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAI") {
    generateSummary(request.text, request.title, request.url)
      .then(summary => sendResponse({ summary }))
      .catch(error => {
        console.error(error);
        sendResponse({ error: "Failed to generate summary: " + error.message });
      });
    return true; // async
  }
});

async function generateSummary(text, title, url) {
  // Use the live Vercel API endpoint for the PM Directory
  const API_URL = "https://www.pmdirectory.net/api/summarize";

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        title: title,
        url: url,
        anonymousId: 'chrome-extension-user',
        prompt: "Summarize the following text. The summary length should be proportional to the source length (approx 10-15% of source), ranging from a 1-minute read for short articles to a 5-minute read for very long ones. Use markdown for structure."
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}