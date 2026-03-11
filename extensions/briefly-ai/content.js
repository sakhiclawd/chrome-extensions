chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageInfo") {
    const text = document.body.innerText || "";
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Avg 200 wpm
    sendResponse({ readingTime });
  }

  if (request.action === "summarize") {
    const pageText = document.body.innerText
      .replace(/\s+/g, ' ')
      .substring(0, 6000); // Cap text for LLM window

    // Forward to background script to call API (bypass CORS)
    chrome.runtime.sendMessage({
      action: "callAI",
      text: pageText,
      url: window.location.href,
      title: document.title
    }, (response) => {
      sendResponse(response);
    });
    return true; // Keep channel open for async response
  }
});