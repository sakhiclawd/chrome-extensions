chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getDomainInfo") {
    const hostname = window.location.hostname;
    // Normalize domain for the analyzer
    const parts = hostname.split('.');
    let rootDomain = hostname;
    if (parts.length > 2) {
      rootDomain = parts.slice(-2).join('.');
    }
    
    sendResponse({ 
      hostname: hostname,
      rootDomain: rootDomain,
      fullUrl: window.location.href
    });
  }
});
