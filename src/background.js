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

const GLOBAL_JS_RULE_ID = 9000001;
const GLOBAL_IMG_RULE_ID = 9000002;
const GLOBAL_VIDEO_RULE_ID = 9000003;

chrome.runtime.onInstalled.addListener(async function (object) {
  // chrome.tabs.create({ url: "options.html?tab=about" });
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

    // chrome.runtime.openOptionsPage();
    chrome.tabs.create({ url: "options.html?tab=about" });
  }
  chrome.storage.local.set({ paused: false });
});
