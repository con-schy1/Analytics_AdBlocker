// This code is protected under Apache-2.0 license

const ctx = document.getElementById("myChart").getContext("2d");
let chart = null;

// --- CHART LOGIC ---
function createChartConfig(storageData) {
  // 1. Aggregate Data by Domain
  let aggregated = {};
  let totalAds = 0;
  let totalAnalytics = 0;

  for (let key in storageData) {
    let entry = storageData[key];
    let domain = entry.hostURL;

    if (!aggregated[domain]) {
      aggregated[domain] = { ads: 0, analytics: 0 };
    }

    aggregated[domain].ads += entry.Ads || 0;
    aggregated[domain].analytics += entry.Analytics || 0;
  }

  // Update UI Stats
  Object.values(aggregated).forEach((v) => {
    totalAds += v.ads;
    totalAnalytics += v.analytics;
  });

  document.getElementById("total-blocked").innerText =
    totalAds + totalAnalytics;
  document.getElementById("ads-blocked").innerText = totalAds;
  document.getElementById("analytics-blocked").innerText = totalAnalytics;

  // 2. Prepare Top 10 for Chart
  let sorted = Object.keys(aggregated)
    .map((domain) => ({
      domain,
      ads: aggregated[domain].ads,
      analytics: aggregated[domain].analytics,
    }))
    .sort((a, b) => b.ads + b.analytics - (a.ads + a.analytics))
    .slice(0, 10);

  return {
    type: "bar",
    data: {
      labels: sorted.map((item) => item.domain),
      datasets: [
        {
          label: "Ads",
          data: sorted.map((item) => item.ads),
          backgroundColor: "#ebdc3d",
          borderRadius: 4,
        },
        {
          label: "Trackers",
          data: sorted.map((item) => item.analytics),
          backgroundColor: "#f18931",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
      plugins: {
        legend: { position: "top" },
      },
    },
  };
}

function initChart(data) {
  if (chart) chart.destroy();
  const canvas = document.getElementById("myChart");
  if (canvas) {
    chart = new Chart(canvas, createChartConfig(data));
  }
}

// --- REQUEST LOG LOGIC ---
function populateRequestList(data) {
  const listContainer = document.getElementById("requestDiv");
  const template = document.getElementById("site-info-template");

  if (!listContainer || !template) return;

  listContainer.innerHTML = "";
  let hasData = false;

  for (let key in data) {
    hasData = true;
    let item = data[key];

    // Clone Template
    let clone = template.content.cloneNode(true);

    // Set Domain Name
    clone.querySelector(".site-name").innerText = item.hostURL || "Unknown";

    // Count items
    let adCount = item.totalAd || 0;
    let trackerCount = item.totalAnal || 0;
    let totalCount = adCount + trackerCount;

    // Badge
    let badge = clone.querySelector(".badge-count");
    if (totalCount > 0) {
      badge.innerText = `${totalCount} Blocked`;
      badge.classList.remove("hidden");
    }

    // Details Section Logic
    let toggleBtn = clone.querySelector(".btn-toggle");
    let detailsDiv = clone.querySelector(".log-details");

    if (totalCount === 0) {
      toggleBtn.style.display = "none"; // Hide button if nothing to show
    } else {
      toggleBtn.addEventListener("click", () => {
        let isHidden = detailsDiv.classList.contains("hidden");
        if (isHidden) {
          detailsDiv.classList.remove("hidden");
          toggleBtn.innerText = "Hide";

          // Lazy load details content
          let html = "";
          if (adCount > 0)
            html += `<div><strong>Ads:</strong> ${adCount} found</div>`;
          if (trackerCount > 0)
            html += `<div><strong>Trackers:</strong> ${trackerCount} found</div>`;
          detailsDiv.innerHTML = html;
        } else {
          detailsDiv.classList.add("hidden");
          toggleBtn.innerText = "Details";
        }
      });
    }

    listContainer.appendChild(clone);
  }

  if (!hasData) {
    listContainer.innerHTML = `<div style="padding:20px; text-align:center; color:#888;">No activity recorded yet.</div>`;
  }
}

// --- APP INIT ---
function refreshApp() {
  chrome.storage.session.get(null).then((data) => {
    initChart(data);
    populateRequestList(data);
  });
}

// Navigation Tabs
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all tabs
    document
      .querySelectorAll(".nav-item")
      .forEach((b) => b.classList.remove("active"));
    // Add to clicked
    btn.classList.add("active");

    // Hide all views
    document
      .querySelectorAll(".view-section")
      .forEach((v) => v.classList.add("hidden"));
    document
      .querySelectorAll(".view-section")
      .forEach((v) => v.classList.remove("active"));

    // Show target view
    const tabId = btn.getAttribute("data-tab");
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
      targetView.classList.remove("hidden");
      targetView.classList.add("active");
    }

    // Update Title
    document.getElementById("page-title").innerText = btn.innerText;

    // Resize chart if showing dashboard
    if (tabId === "dashboard" && chart) {
      chart.resize();
    }
  });
});

// Buttons
const clearBtn = document.getElementById("clear-data-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear all data?")) {
      chrome.storage.session.clear();
      refreshApp();
    }
  });
}

const refreshBtn = document.getElementById("refresh-log");
if (refreshBtn) {
  refreshBtn.addEventListener("click", refreshApp);
}

// Init
refreshApp();
chrome.storage.onChanged.addListener(refreshApp);
