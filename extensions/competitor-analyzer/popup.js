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
    statusMsg: document.getElementById('statusMsg'),
    scopeSelector: document.getElementById('scopeSelector'),
    competitorList: document.getElementById('competitorList'),
    compareBtn: document.getElementById('compareBtn'),
    compareInput: document.getElementById('compareInput'),
    compareResults: document.getElementById('compareResults'),
    compareLoading: document.getElementById('compareLoading'),
    compTitle1: document.getElementById('compTitle1'),
    compTitle2: document.getElementById('compTitle2'),
    compareTableBody: document.getElementById('compareTableBody')
  };

  let currentDomain = '';
  let currentSubdomain = '';
  let currentRootDomain = '';
  let currentMetrics = null;
  let isDemoMode = false;

  // Tab switching logic
  const tabs = ['Summary', 'Traffic', 'Keywords', 'Backlinks', 'Competitors', 'Compare'];
  tabs.forEach(tab => {
    const tabEl = document.getElementById(`tab${tab}`);
    const panelEl = document.getElementById(`panel${tab}`);

    if (tabEl && panelEl) {
      tabEl.addEventListener('click', () => {
        tabs.forEach(t => {
          const tEl = document.getElementById(`tab${t}`);
          const pEl = document.getElementById(`panel${t}`);
          if (tEl) tEl.classList.remove('active');
          if (pEl) pEl.style.display = 'none';
        });
        tabEl.classList.add('active');
        panelEl.style.display = 'block';
      });
    }
  });

  // Scope Selector Logic
  if (elements.scopeSelector) {
    elements.scopeSelector.addEventListener('change', () => {
      const selectedScope = elements.scopeSelector.value;
      const newDomain = selectedScope === 'root' ? currentRootDomain : currentSubdomain;
      if (newDomain !== currentDomain) {
        currentDomain = newDomain;
        elements.domainName.innerText = currentDomain;
        analyzeDomain(currentDomain);
      }
    });
  }

  // Initialize - Get domain and fetch metrics
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (!tabs[0] || !tabs[0].url || tabs[0].url.startsWith('chrome://')) {
      elements.domainName.innerText = "System Page";
      elements.loading.innerText = "Cannot analyze browser system pages.";
      elements.loading.style.display = 'block';
      elements.content.style.display = 'none';
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { action: "getDomainInfo" }, function(response) {
      if (chrome.runtime.lastError) {
        // Fallback if content script isn't ready
        const url = new URL(tabs[0].url);
        currentSubdomain = url.hostname;
        const parts = currentSubdomain.split('.');
        currentRootDomain = parts.length > 2 ? parts.slice(-2).join('.') : currentSubdomain;
        setupInitialDomain();
      } else if (response && response.hostname) {
        currentSubdomain = response.hostname;
        currentRootDomain = response.rootDomain || response.hostname;
        setupInitialDomain();
      } else {
        elements.domainName.innerText = "Error";
        elements.loading.innerText = "Please refresh the page.";
      }
    });
  });

  function setupInitialDomain() {
    // Check for Demo Mode (development testing)
    const isLocalDev = currentSubdomain === 'localhost' || currentSubdomain === '127.0.0.1';
    
    if (currentSubdomain.includes('pmdirectory.net') || isLocalDev) {
      isDemoMode = true;
      const titleEl = document.querySelector('.title');
      if (titleEl) titleEl.innerText = "COMPETITOR ANALYZER (DEMO)";
    }

    // Default to root domain
    currentDomain = currentRootDomain;
    if (elements.scopeSelector) elements.scopeSelector.value = 'root';

    elements.domainName.innerText = currentDomain;
    analyzeDomain(currentDomain);
  }

  /**
   * Send message to background script to fetch analysis
   */
  async function analyzeDomain(domain) {
    elements.loading.style.display = 'block';
    elements.content.style.display = 'none';

    // If in demo mode, provide high-signal mockup data
    if (isDemoMode) {
      setTimeout(() => {
        const demoMetrics = {
          summary: { status: "Dominant", category: "B2B / SaaS / Marketplace" },
          traffic: { monthlyVisits: "1.2M+", avgDuration: "4m 52s", bounceRate: "38.4%" },
          seo: { keywordCount: "42.5K", estMonthlyCost: "$185K" },
          backlinks: { totalBacklinks: "840K", refDomains: "4.2K" },
          competitors: [
            { domain: "rival-saas.com", overlap: "58%" },
            { domain: "big-market-inc.com", overlap: "45%" },
            { domain: "niche-player.io", overlap: "32%" }
          ],
          insights: [
            "&bull; Massive organic footprint with 42K+ ranking keywords.",
            "&bull; Exceptionally high engagement (4m+ avg session duration).",
            "&bull; Tier-1 backlink profile from high-authority domains.",
            "&bull; Primary traffic source: Search (62%) and Direct (28%)."
          ]
        };
        updateUI(demoMetrics);
        currentMetrics = demoMetrics;
      }, 600);
      return;
    }

    chrome.runtime.sendMessage({ action: "fetchMetrics", domain: domain }, function(response) {
      if (response && response.success) {
        // In a real scenario, insights would be generated based on metrics
        const metrics = response.metrics;
        metrics.insights = generateInsights(metrics);
        updateUI(metrics);
        currentMetrics = metrics;
      } else {
        elements.loading.innerText = "Analysis failed. Check your connection.";
        console.error('Fetch failed:', response ? response.error : 'Unknown');
      }
    });
  }

  /**
   * Generate factual insights based on metrics
   */
  function generateInsights(metrics) {
    const insights = [];
    const visitsStr = metrics.traffic.monthlyVisits || "0";
    const visits = parseInt(visitsStr.replace(/[^0-9]/g, ''));
    const backlinksStr = metrics.backlinks.totalBacklinks || "0";
    const backlinks = parseInt(backlinksStr.replace(/[^0-9]/g, ''));
    const bounceRate = parseFloat(metrics.traffic.bounceRate) || 100;

    if (visits > 1000000) {
      insights.push("Dominant market leader with 1M+ monthly visits.");
    } else if (visits > 100000) {
      insights.push("High-volume established player with steady traffic.");
    } else {
      insights.push("Growing market participant with specific niche focus.");
    }

    if (backlinks > 10000) {
      insights.push("Exceptional domain authority with 10K+ backlinks.");
    } else if (backlinks > 1000) {
      insights.push("Strong backlink profile indicating solid SEO authority.");
    }

    if (bounceRate < 40) {
      insights.push("Highly engaging content with very low bounce rate (<40%).");
    } else if (bounceRate < 50) {
      insights.push("Healthy user engagement with optimal bounce rate levels.");
    }

    const keywordCountStr = metrics.seo.keywordCount || "0";
    const keywordCount = parseInt(keywordCountStr.replace(/[^0-9]/g, ''));
    if (keywordCount > 5000) {
      insights.push("Broad organic visibility across 5K+ ranking keywords.");
    }

    return insights;
  }

  /**
   * Update popup UI with fetched data
   */
  function updateUI(metrics) {
    // Summary
    elements.domainStatus.innerText = metrics.summary.status;
    elements.domainCategory.innerText = metrics.summary.category;
    
    // Status visual cue
    const statusColor = metrics.summary.status === 'Dominant' || metrics.summary.status === 'Strong' ? '#10B981' : '#F59E0B';
    elements.domainStatus.style.color = statusColor;

    // Insights
    elements.insightsList.innerHTML = '';
    metrics.insights.forEach(insight => {
      const li = document.createElement('li');
      li.style.listStyle = "none";
      li.style.marginBottom = "8px";
      li.style.display = "flex";
      li.style.alignItems = "flex-start";
      li.innerHTML = `<span style="margin-right:8px; color:#94A3B8;">&bull;</span><span>${insight.replace(/^&bull;\s*/, '')}</span>`;
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

    // Competitors
    if (elements.competitorList) {
      elements.competitorList.innerHTML = '';
      if (metrics.competitors && metrics.competitors.length > 0) {
        metrics.competitors.forEach(comp => {
          const row = document.createElement('div');
          row.className = 'metric-row';
          row.style.padding = '4px 0';
          row.innerHTML = `<span class="metric-label" style="font-weight:500;">${comp.domain}</span><span class="metric-value" style="color:#6366F1;">${comp.overlap}</span>`;
          elements.competitorList.appendChild(row);
        });
      } else {
        elements.competitorList.innerHTML = '<div style="font-size:12px;color:#94A3B8;text-align:center;padding:10px;">No competitor data available for this domain.</div>';
      }
    }

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
   * Comparison Logic
   */
  if (elements.compareBtn) {
    elements.compareBtn.addEventListener('click', async function() {
      const compareDomain = elements.compareInput.value.trim().toLowerCase();
      if (!compareDomain || compareDomain === currentDomain) return;

      elements.compareLoading.style.display = 'block';
      elements.compareResults.style.display = 'none';
      elements.compareBtn.disabled = true;

      chrome.runtime.sendMessage({ action: "fetchMetrics", domain: compareDomain }, function(response) {
        elements.compareLoading.style.display = 'none';
        elements.compareBtn.disabled = false;

        if (response && response.success) {
          renderComparison(currentMetrics, response.metrics, currentDomain, compareDomain);
        } else {
          showStatus("Failed to fetch comparison data", "error");
        }
      });
    });
  }

  function renderComparison(m1, m2, d1, d2) {
    elements.compTitle1.innerText = d1;
    elements.compTitle2.innerText = d2;
    elements.compareTableBody.innerHTML = '';

    const rows = [
      ['Visits', m1.traffic.monthlyVisits, m2.traffic.monthlyVisits],
      ['Keywords', m1.seo.keywordCount, m2.seo.keywordCount],
      ['Backlinks', m1.backlinks.totalBacklinks, m2.backlinks.totalBacklinks],
      ['Bounce', m1.traffic.bounceRate, m2.traffic.bounceRate]
    ];

    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #f1f5f9';
      tr.innerHTML = `
        <td style="padding: 8px 0; color: #64748B;">${row[0]}</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${row[1]}</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${row[2]}</td>
      `;
      elements.compareTableBody.appendChild(tr);
    });

    elements.compareResults.style.display = 'block';
  }

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
