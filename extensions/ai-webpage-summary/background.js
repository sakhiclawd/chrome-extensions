// AI Webpage Summary - Background Script
// Handles API calls to bypass CORS and manage global state

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callAI") {
    generateSummary(request.text, request.title)
      .then(summary => sendResponse({ summary }))
      .catch(error => {
        console.error(error);
        sendResponse({ error: "Failed to generate summary" });
      });
    return true; // async
  }
});

async function generateSummary(text, title) {
  // In a production app, you would call your Vercel/Cloudflare worker here.
  // For this build, we'll simulate the logic or call an LLM endpoint directly
  // if an API key is provided via storage.

  const prompt = `Summarize the following webpage content titled "${title}". 
  Provide a 1-sentence overview, followed by 3-5 key bullet points. 
  Content: ${text}`;

  // TEMPLATE: Replace with your actual backend endpoint
  // const API_URL = "https://your-ai-worker.vercel.app/api/summarize";
  // const response = await fetch(API_URL, { ... });

  // Simulation of AI response for initial build
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`**Overview:** This page discusses ${title}.\n\n* Key point about the main topic.\n* Important insight from the article content.\n* Significant data or conclusion reached.\n* Final takeaway for the reader.`);
    }, 1500);
  });
}