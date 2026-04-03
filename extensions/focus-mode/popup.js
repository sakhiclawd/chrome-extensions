document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const timerDisplay = document.getElementById('timer-display');
  const rulesCount = document.getElementById('rules-count');
  let timerInterval = null;

  function updateTimerDisplay() {
    chrome.storage.local.get(['focus_mode_active', 'focus_session_end'], (data) => {
      if (data.focus_mode_active && data.focus_session_end) {
        const timeLeft = Math.max(0, Math.round((data.focus_session_end - Date.now()) / 1000));
        if (timeLeft <= 0) {
          stopTimer();
          return;
        }
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    });
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    chrome.storage.local.set({ focus_mode_active: false });
    chrome.alarms.clear('focus_timer');
    chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ['ruleset_1'] });
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    timerDisplay.textContent = '25:00';
    rulesCount.textContent = '0';
  }

  startBtn.addEventListener('click', function () {
    const duration = 25 * 60; // 25 minutes in seconds
    const sessionEnd = Date.now() + (duration * 1000);
    
    chrome.storage.local.set({ focus_mode_active: true, focus_session_end: sessionEnd });
    chrome.alarms.create('focus_timer', { delayInMinutes: 25 });
    chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ['ruleset_1'] });
    
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    rulesCount.textContent = '3';
    startTimer();
  });

  stopBtn.addEventListener('click', function () {
    stopTimer();
  });

  // Initial UI check
  chrome.storage.local.get(['focus_mode_active', 'focus_session_end'], (data) => {
    if (data.focus_mode_active) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      const timeLeft = Math.max(0, Math.round((data.focus_session_end - Date.now()) / 1000));
      if (timeLeft > 0) {
        rulesCount.textContent = '3';
        startTimer();
      } else {
        stopTimer();
      }
    }
  });
});
