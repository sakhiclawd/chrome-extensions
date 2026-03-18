document.addEventListener('DOMContentLoaded', function() {
  const domainNameText = document.getElementById('domainName');
  const monthlyVisits = document.getElementById('monthlyVisits');
  const keywordCount = document.getElementById('keywordCount');
  const backlinkCount = document.getElementById('backlinkCount');
  const saveBtn = document.getElementById('saveBtn');
  const viewBtn = document.getElementById('viewBtn');
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');
  const statusMsg = document.getElementById('statusMsg');

  const tabs = ['Summary', 'Traffic', 'Keywords', 'Backlinks'];
  let currentDomain = '';

  // Tab switching logic
  const tabNames = ['Summary', 'Traffic', 'Keywords', 'Backlinks'];
  tabNames.forEach(tab => {
    const tabEl = document.getElementById(`tab${tab}`);
    const panelEl = document.getElementById(`panel${tab}`);
    
    tabEl.addEventListener('click', () => {
      // Deactivate all
      tabNames.forEach(t => {
        const tEl = document.getElementById(`tab${t}`);
        const pEl = document.getElementById(`panel${t}`);
        if (tEl) tEl.classList.remove('active');
        if (pEl) pEl.style.display = 'none';
      });
      // Activate selected
      tabEl.classList.add('active');
      panelEl.style.display = 'block';
    });
  });

  // Get domain from content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0] || !tabs[0].id) {
        domainNameText.innerText = "No active tab";
        return;
    }
    
    chrome.tabs.sendMessage(tabs[0].id, {action: "getDomainInfo"}, function(response) {
      if (response && response.hostname) {
        currentDomain = response.rootDomain || response.hostname;
        domainNameText.innerText = currentDomain;
        analyzeDomain(currentDomain);
      } else {
        domainNameText.innerText = "Check Tab";
      }
    });
  });

  async function analyzeDomain(domain) {
    loading.style.display = 'block';
    content.style.display = 'none';

    try {
      // Future API integration
      // const response = await fetch(`https://www.pmdirectory.net/api/competitor-stats?domain=${domain}`);
      // const data = await response.json();
      
      // Simulation for MV3 Demo
      setTimeout(() => {
        monthlyVisits.innerText = '412K';
        keywordCount.innerText = '8.4K';
        backlinkCount.innerText = '12.1K';
        
        loading.style.display = 'none';
        content.style.display = 'block';
      }, 800);

    } catch (error) {
      console.error('Analysis error:', error);
      loading.innerText = "Error analyzing domain.";
    }
  }

  saveBtn.addEventListener('click', async function() {
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";
    
    // Simulate API call to PMLibrary
    setTimeout(() => {
        saveBtn.innerText = "Save Snapshot";
        saveBtn.disabled = false;
        
        statusMsg.innerText = "Successfully saved to PMLibrary";
        statusMsg.className = "status-msg status-success";
        statusMsg.style.display = "block";
        
        setTimeout(() => { statusMsg.style.display = "none"; }, 3000);
    }, 1200);
  });

  viewBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://www.pmdirectory.net/library' });
  });
});
