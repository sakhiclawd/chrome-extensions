chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start_focus') {
    const sessionDuration = 25 * 60 * 1000; // 25 minutes
    const sessionEnd = Date.now() + sessionDuration;
    chrome.storage.local.set({ focus_mode_active: true, focus_session_end: sessionEnd });
    chrome.alarms.create('focus_timer', { delayInMinutes: 25 });
    chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ['ruleset_1'] });
    sendResponse({ status: 'started', timeLeft: 25 * 60, rulesCount: 3 });
  } else if (request.action === 'stop_focus') {
    chrome.storage.local.set({ focus_mode_active: false });
    chrome.alarms.clear('focus_timer');
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ruleset_1'] });
    sendResponse({ status: 'stopped' });
  }
  return true; // Keep message channel open for async response
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focus_timer') {
    chrome.storage.local.set({ focus_mode_active: false });
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ruleset_1'] });
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Focus Complete',
      message: 'Great job! Your focus session has ended.',
      priority: 2
    });
  }
});
