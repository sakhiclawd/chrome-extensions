document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const timerDisplay = document.getElementById('timer-display');
  const rulesCount = document.getElementById('rules-count');

  startBtn.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'start_focus' }, (response) => {
      if (response && response.status === 'started') {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        rulesCount.textContent = response.rulesCount;
        updateTimer(response.timeLeft);
      }
    });
  });

  stopBtn.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'stop_focus' }, (response) => {
      if (response && response.status === 'stopped') {
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        updateTimer(25 * 60);
      }
    });
  });

  function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Initial UI check
  chrome.storage.local.get(['focus_mode_active', 'focus_session_end'], (data) => {
    if (data.focus_mode_active) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      const timeLeft = Math.max(0, Math.round((data.focus_session_end - Date.now()) / 1000));
      updateTimer(timeLeft);
    }
  });
});
