document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        domainName: document.getElementById('domainName'),
        monthlyVisits: document.getElementById('monthlyVisits'),
        avgDuration: document.getElementById('avgDuration'),
        bounceRate: document.getElementById('bounceRate'),
        keywordCount: document.getElementById('keywordCount'),
        estSEOCost: document.getElementById('estSEOCost'),
        backlinkCount: document.getElementById('backlinkCount'),
        refDomains: document.getElementById('refDomains'),
        domainStatus: document.getElementById('domainStatus'),
        domainCategory: document.getElementById('domainCategory'),
        insightsList: document.getElementById('insightsList'),
        saveBtn: document.getElementById('saveBtn'),
        viewBtn: document.getElementById('viewBtn'),
        loading: document.getElementById('loading'),
        content: document.getElementById('content'),
        statusMsg: document.getElementById('statusMsg')
    };

    let currentDomain = '';
    let currentMetrics = null;

    // Tab switching logic
    const tabs = ['Summary', 'Traffic', 'Keywords', 'Backlinks'];
    tabs.forEach(tab => {
        const tabEl = document.getElementById(`tab${tab}`);
        const panelEl = document.getElementById(`panel${tab}`);
        
        tabEl.addEventListener('click', () => {
            tabs.forEach(t => {
                document.getElementById(`tab${t}`).classList.remove('active');
                document.getElementById(`panel${t}`).style.display = 'none';
            });
            tabEl.classList.add('active');
            panelEl.style.display = 'block';
        });
    });

    // Initialize - Get domain and fetch metrics
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs[0] || !tabs[0].id) {
            elements.domainName.innerText = "No active tab";
            return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, {action: "getDomainInfo"}, function(response) {
            if (response && response.hostname) {
                currentDomain = response.rootDomain || response.hostname;
                elements.domainName.innerText = currentDomain;
                analyzeDomain(currentDomain);
            } else {
                elements.domainName.innerText = "Error Accessing Tab";
                elements.loading.innerText = "Please refresh the page and try again.";
            }
        });
    });

    /**
     * Send message to background script to fetch analysis
     */
    async function analyzeDomain(domain) {
        elements.loading.style.display = 'block';
        elements.content.style.display = 'none';

        chrome.runtime.sendMessage({action: "fetchMetrics", domain: domain}, function(response) {
            if (response && response.success) {
                updateUI(response.metrics);
                currentMetrics = response.metrics;
            } else {
                elements.loading.innerText = "Analysis failed. Check your connection.";
                console.error('Fetch failed:', response ? response.error : 'Unknown');
            }
        });
    }

    /**
     * Update popup UI with fetched data
     */
    function updateUI(metrics) {
        // Summary
        elements.domainStatus.innerText = metrics.summary.status;
        elements.domainCategory.innerText = metrics.summary.category;
        
        // Insights
        elements.insightsList.innerHTML = '';
        metrics.insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            elements.insightsList.appendChild(li);
        });

        // Traffic
        elements.monthlyVisits.innerText = metrics.traffic.monthlyVisits;
        elements.avgDuration.innerText = metrics.traffic.avgDuration;
        elements.bounceRate.innerText = metrics.traffic.bounceRate;

        // Keywords
        elements.keywordCount.innerText = metrics.seo.keywordCount;
        elements.estSEOCost.innerText = metrics.seo.estMonthlyCost;

        // Backlinks
        elements.backlinkCount.innerText = metrics.backlinks.totalBacklinks;
        elements.refDomains.innerText = metrics.backlinks.refDomains;
        
        elements.loading.style.display = 'none';
        elements.content.style.display = 'block';
    }

    /**
     * Save snapshot event
     */
    elements.saveBtn.addEventListener('click', function() {
        if (!currentMetrics) return;

        elements.saveBtn.disabled = true;
        elements.saveBtn.innerText = "Saving...";
        
        chrome.runtime.sendMessage({
            action: "saveSnapshot", 
            data: {
                domain: currentDomain,
                metrics: currentMetrics
            }
        }, function(response) {
            elements.saveBtn.innerText = "Save Snapshot";
            elements.saveBtn.disabled = false;
            
            if (response && response.success) {
                showStatus("Successfully saved to PMLibrary", "success");
            } else {
                showStatus("Save failed: Service unreachable", "error");
            }
        });
    });

    /**
     * Open PMLibrary dashboard
     */
    elements.viewBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://www.pmdirectory.net/library' });
    });

    /**
     * Utility to show status message
     */
    function showStatus(msg, type) {
        elements.statusMsg.innerText = msg;
        elements.statusMsg.className = `status-msg status-${type}`;
        elements.statusMsg.style.display = "block";
        
        setTimeout(() => { 
            elements.statusMsg.style.display = "none"; 
        }, 3000);
    }
});
