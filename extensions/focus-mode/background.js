// Focus Mode - Background Service Worker
// Handles alarm-based focus session completion

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focus_timer') {
    chrome.storage.local.set({ focus_mode_active: false });
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ruleset_1'] });
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Focus Complete',
      message: 'Great job! Your 25-minute focus session has ended.',
      priority: 2
    });
  }
});

// Handle extension install/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Focus Mode extension installed');
});