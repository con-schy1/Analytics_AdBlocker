// This code is protected under Apache-2.0 license

const ctx = document.getElementById("myChart").getContext("2d");
let hosts = [];

// --- Data Models ---
class Hosts {
  constructor(time, url, Ads, Analytics) {
    this.time = time;
    this.url = url;
    this.Ads = Ads;
    this.Analytics = Analytics;
  }
}

class Dataset {
  constructor(label, bgcolor) {
    this.label = label;
    this.data = hosts.map((z) => z[label]);
    this.backgroundColor = bgcolor;
    this.borderColor = bgcolor;
    this.borderWidth = 1;
    this.borderRadius = 4;
  }
}

// --- Chart Logic ---
function chartConfig(storageData) {
  hosts = []; // Reset array

  let totalAds = 0;
  let totalAnalytics = 0;

  for (let z in storageData) {
    let entry = storageData[z];
    // Add to stats
    totalAds += entry.Ads || 0;
    totalAnalytics += entry.Analytics || 0;

    hosts.push(
      new Hosts(entry.storedAt, entry.hostURL, entry.Ads, entry.Analytics),
    );
  }

  // Update Dashboard Numbers
  document.getElementById("total-blocked").innerText =
    totalAds + totalAnalytics;
  document.getElementById("ads-blocked").innerText = totalAds;
  document.getElementById("analytics-blocked").innerText = totalAnalytics;

  // Create Datasets
  const datasets = [
    new Dataset("Ads", "#ebdc3d"), // Yellow
    new Dataset("Analytics", "#f18931"), // Orange
  ];

  return {
    type: "bar",
    data: {
      labels: hosts.map((z) => z.url),
      datasets: datasets,
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

let chart = null;

function initChart(data) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, chartConfig(data));
}

// --- Load Data ---
function refreshData() {
  chrome.storage.session.get(null).then((data) => {
    // 1. Draw Chart
    initChart(data);

    // 2. Populate Request List
    populateRequestList(data);
  });
}

// --- Request List Logic ---
const requestDiv = document.getElementById("requestDiv");
const siteInfoTemplate = document.getElementById("site-info-template");

function populateRequestList(data) {
  requestDiv.innerHTML = ""; // Clear list
  let hasData = false;

  for (let x in data) {
    hasData = true;
    let item = data[x];

    // Clone Template
    let clone = siteInfoTemplate.content.cloneNode(true);

    // Fill Info
    clone.querySelector(".site-name").innerText = item.hostURL;

    // Setup Toggle
    let moreBtn = clone.querySelector(".site-more");
    let sections = clone.querySelector(".list-sections");

    moreBtn.addEventListener("click", () => {
      sections.classList.toggle("hidden");
      moreBtn.classList.toggle("site-more-rotated");
    });

    // Add lists
    let imgList = clone.querySelector(".site-image-list");
    let frameList = clone.querySelector(".site-frame-list");

    if (item.foundHTTPArray)
      imgList.innerHTML += `<div><strong>Trackers:</strong> ${item.foundHTTPArray.length}</div>`;
    if (item.foundHTTPADArray)
      frameList.innerHTML += `<div><strong>Ads:</strong> ${item.foundHTTPADArray.length}</div>`;

    requestDiv.appendChild(clone);
  }

  if (!hasData) {
    requestDiv.innerHTML = '<p class="empty-state">No data captured yet.</p>';
  }
}

// --- UI Navigation Tabs ---
document.querySelectorAll(".nav-links li").forEach((tab) => {
  tab.addEventListener("click", () => {
    // 1. UI Active State
    document
      .querySelectorAll(".nav-links li")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // 2. Switch Views
    const tabId = tab.getAttribute("data-tab");
    document
      .querySelectorAll(".view-section")
      .forEach((view) => (view.style.display = "none"));

    // Map tab ID to view ID
    if (tabId === "dashboard")
      document.getElementById("view-dashboard").style.display = "block";
    if (tabId === "requests")
      document.getElementById("view-requests").style.display = "block";
    if (tabId === "settings")
      document.getElementById("view-settings").style.display = "block";

    // Update Header Title
    document.getElementById("page-title").innerText = tab.innerText.trim();
  });
});

// --- Clear Data Button ---
const clearBtn = document.getElementById("clear-data-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all stats?")) {
      chrome.storage.session.clear();
      refreshData();
      alert("Data cleared.");
    }
  });
}

// --- Init ---
refreshData();

// Listen for live updates
chrome.storage.onChanged.addListener(() => {
  refreshData();
});
