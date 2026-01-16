// content.js
let blockedQueue = [],
  observer = null,
  intervalId = null,
  isSimulating = false;

function startSimulation() {
  if (isSimulating) return;
  isSimulating = true;

  observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // FIX: Only capture likely blocked requests (0 bytes transferred)
      if (entry.transferSize < 3 && entry.decodedBodySize < 3) {
        blockedQueue.push({
          url: entry.name,
          initiator: window.location.href,
          type: entry.initiatorType || "other",
          ts: Date.now(),
        });
      }
    });
  });

  observer.observe({ type: "resource", buffered: true });

  // 2. Start Interval
  intervalId = setInterval(() => {
    if (blockedQueue.length > 0) {
      chrome.runtime.sendMessage({
        type: "DNR_MATCH_BATCH",
        items: blockedQueue,
      });
      blockedQueue = [];
    }
  }, 2000);
  console.log("AdBlocker: Simulation Mode Enabled (Store Version)");
}

function stopSimulation() {
  // 1. Stop Observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // 2. Stop Interval
  if (intervalId) {
    clearInterval(intervalId); // <--- Critical: Stop the loop
    intervalId = null;
  }

  isSimulating = false;
  blockedQueue = []; // Optional: Clear pending queue
  console.log("AdBlocker: Simulation Mode Disabled");
}

// ... Listeners remain the same ...
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "DNR_STATUS_UPDATE") {
    msg.useSimulatedMode ? startSimulation() : stopSimulation();
  }
  console.log(msg);
  if (msg.type == "UNSAFE_TAB_URL") {
    const style = document.createElement("style");
    style.textContent = `
      .aa-unsafe {
        border: 6px solid red !important;
      }
    `;
    document.body.appendChild(style);
    document.body.classList.add("aa-unsafe");
    console.log(document.body);
    setTimeout(() => {
      document.body.classList.remove("aa-unsafe");
    }, 10_000);
  }
});

chrome.runtime.sendMessage({ type: "GET_DNR_STATUS" }, (res) => {
  if (res && res.useSimulatedMode) startSimulation();
});
