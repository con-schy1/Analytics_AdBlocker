//This code is protected under Apache-2.0 license

const MAXSITES = 14;

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.status == "complete") {
    // Check paused state before triggering the content script
    chrome.storage.local.get("paused").then((data) => {
      if (!data.paused) {
        chrome.tabs.sendMessage(tabId, { start: true });
      }
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  // Check if sender.tab exists (it might not for some internal messages)
  if (!sender.tab) return;

  let data = await chrome.storage.session.get(null);

  // Clean up old data
  let storedAt = 99999999999999999999999;
  let toRemove = null;

  if (Object.keys(data).length >= MAXSITES) {
    for (let z in data) {
      if (data[z].storedAt < storedAt) {
        storedAt = data[z].storedAt;
        toRemove = z;
      }
    }
    if (toRemove) chrome.storage.session.remove(toRemove);
  }

  // Store new data
  chrome.storage.session.set({ ["tab" + sender.tab.id]: request });

  // Update Badge Color
  let colorString = "#ff0d21"; // Default Red
  if (request.totalTot <= 5)
    colorString = "#32a852"; // Green
  else if (request.totalTot <= 14)
    colorString = "#8ECA2E"; // Light Green
  else if (request.totalTot <= 24)
    colorString = "#f4e03a"; // Yellow
  else if (request.totalTot <= 35) colorString = "#f18931"; // Orange

  chrome.action.setBadgeBackgroundColor({
    color: colorString,
    tabId: sender.tab.id,
  });

  chrome.action.setBadgeText({
    text: request.totalString,
    tabId: sender.tab.id,
  });
});

// Clear Cache when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.get("tab" + tabId).then((data) => {
    if (data && data["tab" + tabId]) {
      // Note: 'delete' keyword doesn't work directly on storage.session
      // We must use chrome.storage.session.remove
      chrome.storage.session.remove("tab" + tabId);
    }
  });
});

const GLOBAL_JS_RULE_ID = 9000001;
const GLOBAL_IMG_RULE_ID = 9000002;
const GLOBAL_VIDEO_RULE_ID = 9000003;

chrome.runtime.onInstalled.addListener(async function (object) {
  let externalUrl = "https://github.com/con-schy1/Analytics_AdBlocker#readme";
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // 1. Get all existing dynamic rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map((rule) => rule.id);

    // 2. Remove them if any exist
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
      });
      console.log("All dynamic rules cleared on install.");
    }

    chrome.storage.local.clear();

    await chrome.storage.local.set({
      globalToggles: { js: false, images: false, videos: false },
    });

    chrome.tabs.create({ url: externalUrl });
  }
  chrome.storage.local.set({ paused: false });
});
