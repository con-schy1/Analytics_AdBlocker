//This code is protected under Apache-2.0 license
const LOG_KEY = "dnrMatchLogByTab";
const MAX_PER_TAB = 200;
const MAXSITES = 14;

// ---- helpers ----
async function getLogMap() {
  const obj = await chrome.storage.session.get(LOG_KEY);
  return obj[LOG_KEY] || {};
}

async function setLogMap(map) {
  await chrome.storage.session.set({ [LOG_KEY]: map });
}

async function getFlatLogs({ minTimeStamp } = {}) {
  const map = await getLogMap();
  const items = Object.values(map).flat();

  if (typeof minTimeStamp === "number") {
    return items.filter((x) => (x?.ts ?? 0) >= minTimeStamp);
  }
  return items;
}

async function clearAllLogs() {
  await setLogMap({});
}

async function appendLog(tabId, entry) {
  if (tabId == null || tabId < 0) return;

  const map = await getLogMap();
  const list = map[String(tabId)] || [];
  list.push(entry);

  // ring buffer
  if (list.length > MAX_PER_TAB) list.splice(0, list.length - MAX_PER_TAB);

  map[String(tabId)] = list;
  await setLogMap(map);
}

async function clearTabLog(tabId) {
  const map = await getLogMap();
  delete map[String(tabId)];
  await setLogMap(map);
}

// ---- A) Best case: live event stream (debug/feedback) ----
// NOTE: availability can depend on browser/channel/policy; guard it.
if (chrome.declarativeNetRequest?.onRuleMatchedDebug?.addListener) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (e) => {
    const tabId = e?.request?.tabId ?? e?.tabId ?? -1;
    if (tabId < 0) return;

    console.log(e);

    // e typically includes: tabId, request: { url, method, type, ... }, rule: { ruleId, rulesetId }, timeStamp...
    await appendLog(tabId, {
      ts: Date.now(),
      source: "onRuleMatchedDebug",
      tabId,
      url: e.request?.url,
      method: e.request?.method,
      type: e.request?.type,
      initiator: e.request?.initiator,
      ruleId: e.rule?.ruleId,
      rulesetId: e.rule?.rulesetId,
      action: "block", // since all your rules are block today
    });
  });
}

// ---- B) Fallback: pull-based snapshot using getMatchedRules() ----
// This usually gives you matched rule IDs (less detail than debug event),
// but still useful for “what rules fired recently?” style UI.
async function snapshotMatches(tabId, minTimeStamp) {
  const res = await chrome.declarativeNetRequest.getMatchedRules({
    tabId,
    minTimeStamp,
  });

  // res.rules is an array of matched rules
  for (const r of res.rules || []) {
    await appendLog(tabId, {
      ts: r.timeStamp || Date.now(),
      source: "getMatchedRules",
      tabId,
      ruleId: r.ruleId,
      rulesetId: r.rulesetId,
    });
  }
}

async function snapshotAllTabs(minTimeStamp) {
  const tabs = await chrome.tabs.query({});
  for (const t of tabs) {
    if (typeof t.id === "number") {
      await snapshotMatches(t.id, minTimeStamp);
    }
  }
}

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
// Clear logs when tab closes (optional)
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabLog(tabId);
});

// ---- Messaging API for popup/options ----
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (!msg || !msg.type) return;

    // tabId: number  => specific tab
    // tabId: null/undefined => all tabs
    const tabId = msg.tabId ?? null;

    if (msg.type === "DNR_LOG_GET") {
      if (tabId === null) {
        const items = await getFlatLogs({ minTimeStamp: msg.minTimeStamp });
        sendResponse({ ok: true, items });
      } else {
        const map = await getLogMap();
        const items = map[String(tabId)] || [];
        const filtered =
          typeof msg.minTimeStamp === "number"
            ? items.filter((x) => (x?.ts ?? 0) >= msg.minTimeStamp)
            : items;
        sendResponse({ ok: true, items: filtered });
      }
      return;
    }
    // if (msg.type === "DNR_LOG_GET") {
    //   const tabId = msg.tabId;
    //   const map = await getLogMap();
    //   sendResponse({ ok: true, items: map[String(tabId)] || [] });
    //   return;
    // }

    if (msg.type === "DNR_LOG_CLEAR") {
      if (tabId === null) await clearAllLogs();
      else await clearTabLog(tabId);
      sendResponse({ ok: true });
      return;
    }

    if (msg.type === "DNR_SNAPSHOT") {
      const minTimeStamp = msg.minTimeStamp ?? Date.now() - 60_000;

      if (tabId === null) await snapshotAllTabs(minTimeStamp);
      else await snapshotMatches(tabId, minTimeStamp);

      sendResponse({ ok: true });
      return;
    }
  })().catch((err) => sendResponse({ ok: false, error: String(err) }));

  return true; // keep the message channel open for async response
});

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
