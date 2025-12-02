//This code is protected under Apache-2.0 license
// import { Chart } from "../chart.js";

var chart;

// Initialize UI state immediately
document.addEventListener("DOMContentLoaded", function () {
  // Check paused state on load
  chrome.storage.local.get("paused").then((data) => {
    if (data.paused) {
      document.getElementById("resume").style.display = "block";
      document.getElementById("pause").style.display = "none";
      // Safely try to update text if it exists
      const blockedText = document.getElementById("blocked");
      if (blockedText) blockedText.innerHTML = "Not Blocked";
      setVisualState(true);
    } else {
      setVisualState(false);
    }
  });
});

function updateChartData(x) {
  if (!chart || !x) return;
  document.getElementById("scoreHTML").innerHTML = x.totalString;
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [x.totalAnal, x.totalAd];
  });
  chart.update();

  const report = document.getElementById("reportAttempt");
  if (report) report.innerHTML = x.totalString;
}

function makeChart(x) {
  if (!x) return;
  document.getElementById("scoreHTML").innerHTML = x.totalString;

  var ctx = document.getElementById("myChart").getContext("2d");
  var yValues = [x.totalAnal, x.totalAd];
  var barColors = ["#f18931", "#ebdc3d"];

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [" Analytics", " Ads"],
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "75%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, // Fixes layout
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + context.raw;
            },
          },
        },
      },
    },
  });
}

// Helper function to toggle visual state
function setVisualState(isPaused) {
  const chartCanvas = document.getElementById("myChart");
  if (isPaused) {
    chartCanvas.classList.add("grayscale-filter");
  } else {
    chartCanvas.classList.remove("grayscale-filter");
  }
}

// Main Logic
chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const currentTab = tabs[0];
  chrome.storage.session.get("tab" + currentTab.id).then((data) => {
    try {
      if (data && data["tab" + currentTab.id]) {
        makeChart(data["tab" + currentTab.id]);
      }
    } catch (e) {
      console.log("Waiting for page data...");
    }
  });

  // Listen for live updates
  chrome.storage.onChanged.addListener(function (changes) {
    for (let [changeKey, { newValue }] of Object.entries(changes)) {
      if (changeKey.includes(currentTab.id)) {
        if (chart) {
          updateChartData(newValue);
        } else {
          makeChart(newValue);
        }
      }
    }
  });
});

// --- FIXED BUTTON HANDLERS ---

const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");

pauseBtn.addEventListener("click", async () => {
  // 1. Update UI immediately for responsiveness
  resumeBtn.style.display = "block";
  pauseBtn.style.display = "none";
  const blockedText = document.getElementById("blocked");
  if (blockedText) blockedText.innerHTML = "Not Blocked";

  setVisualState(true);

  // 2. Set storage
  await chrome.storage.local.set({ paused: true });

  // 3. CRITICAL FIX: Wait for rules to disable BEFORE reloading
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: ["ruleset_1"],
  });

  // 4. Reload tab safely
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    chrome.tabs.reload(tabs[0].id);
  }
});

resumeBtn.addEventListener("click", async () => {
  // 1. Update UI
  pauseBtn.style.display = "block";
  resumeBtn.style.display = "none";
  const blockedText = document.getElementById("blocked");
  if (blockedText) blockedText.innerHTML = "Blocked";

  setVisualState(false);

  // 2. Set storage
  await chrome.storage.local.set({ paused: false });

  // 3. CRITICAL FIX: Wait for rules to enable BEFORE reloading
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ["ruleset_1"],
  });

  // 4. Reload tab
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    chrome.tabs.reload(tabs[0].id);
  }
});

// Settings button
document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
