//This code is protected under Apache-2.0 license
const LOG_KEY = "dnrMatchLogByTab";
const MAX_PER_TAB = 300;
const MAXSITES = 100;
// Cache: ruleId -> action.type (dynamic + session only)
let actionTypeByRuleId = new Map();
const SAFE_BROWSING_API_KEY = "AIzaSyDQb-1deWH2EAKitfCIwkis8dQZ57mqxXQ";
const SAFE_BROWSING_ENDPOINT =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

const SAFE_CACHE_TTL = 23 * 60 * 60 * 1000; // 23 hours
const safeCache = new Map(); // url -> { unsafe: boolean, ts }

// ---- helpers ----

async function checkUrlWithSafeBrowsing(url) {
  const now = Date.now();
  console.log("safeCache", safeCache);

  // cache hit
  const cached = safeCache.get(url);
  if (cached && now - cached.ts < SAFE_CACHE_TTL) {
    return cached.unsafe;
  }

  const payload = {
    client: {
      clientId: "A&A",
      clientVersion: "1.0.0",
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }],
    },
  };

  try {
    const res = await fetch(
      `${SAFE_BROWSING_ENDPOINT}?key=${SAFE_BROWSING_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const unsafe = Array.isArray(data.matches) && data.matches.length > 0;

    safeCache.set(url, { unsafe, ts: now });
    return unsafe;
  } catch (err) {
    console.warn("Safe Browsing error:", err);
    // fail open
    safeCache.set(url, { unsafe: false, ts: now });
    return false;
  }
}

async function rebuildActionCache() {
  const dyn = await chrome.declarativeNetRequest.getDynamicRules(); // includes your toggles + custom rules
  const ses = chrome.declarativeNetRequest.getSessionRules
    ? await chrome.declarativeNetRequest.getSessionRules()
    : [];

  const map = new Map();
  for (const r of [...dyn, ...ses]) {
    if (r?.id != null && r?.action?.type) map.set(r.id, r.action.type);
  }
  actionTypeByRuleId = map;
}

async function resolveActionType(ruleId, rulesetId) {
  // 1) dynamic/session lookup
  if (actionTypeByRuleId.has(ruleId)) return actionTypeByRuleId.get(ruleId);

  // 2) maybe cache is stale (rules added/removed) -> rebuild once
  await rebuildActionCache();
  if (actionTypeByRuleId.has(ruleId)) return actionTypeByRuleId.get(ruleId);

  // 3) static rulesets: no direct lookup; choose a safe fallback
  // If your packaged ruleset_1 is currently only "block", fallback to "block".
  // Later, if you add redirect to static ruleset, add an index file.
  return "block";
}

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
if (
  chrome.declarativeNetRequest.onRuleMatchedDebug &&
  chrome.declarativeNetRequest?.onRuleMatchedDebug?.addListener
) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (e) => {
    const tabId = e?.request?.tabId ?? e?.tabId ?? -1;
    if (tabId < 0) return;

    const ruleId = e?.rule?.ruleId;
    const rulesetId = e?.rule?.rulesetId;
    // const action =
    //   ruleId != null ? await resolveActionType(ruleId, rulesetId) : "block";

    // e typically includes: tabId, request: { url, method, type, ... }, rule: { ruleId, rulesetId }, timeStamp...
    await appendLog(tabId, {
      ts: Date.now(),
      source: "onRuleMatchedDebug",
      tabId,
      url: e.request?.url,
      method: e.request?.method,
      type: e.request?.type,
      initiator: e.request?.initiator,
      ruleId,
      rulesetId,
      action: "block", // since all your rules are block today
    });
  });
} else {
}

// setTimeout(() => { //for testing
//   chrome.storage.local.set({ dashboardUnavailable: true });
// }, 9000);

// ---- B) Fallback: pull-based snapshot using getMatchedRules() ----
// This usually gives you matched rule IDs (less detail than debug event),
// but still useful for “what rules fired recently?” style UI.
// async function snapshotMatches(tabId, minTimeStamp) {
//   const res = await chrome.declarativeNetRequest.getMatchedRules({
//     tabId,
//     minTimeStamp,
//   });

//   for (const r of res.rules || []) {
//     const action = "block"; //await resolveActionType(r.ruleId, r.rulesetId);
//     await appendLog(tabId, {
//       ts: r.timeStamp || Date.now(),
//       source: "getMatchedRules",
//       tabId,
//       ruleId: r.ruleId,
//       rulesetId: r.rulesetId,
//       action,
//     });
//   }
// }

// async function snapshotAllTabs(minTimeStamp) {
//   const tabs = await chrome.tabs.query({});
//   for (const t of tabs) {
//     if (typeof t.id === "number") {
//       await snapshotMatches(t.id, minTimeStamp);
//     }
//   }
// }

// --- OPTIMIZATION: Rule Indexing & Matching Logic ---
const ruleIndex = { domainMap: new Map(), genericRules: [] };

// Initialize: Load rules and build the index
fetch(chrome.runtime.getURL("rules.json"))
  .then((res) => res.json())
  .then((rules) => {
    buildRuleIndex(rules);
    console.log("Rule index built in background.");
  });

function buildRuleIndex(rules) {
  const domainRegex = /([a-z0-9-]+\.[a-z0-9-]+)(?:\/|$)/i;
  rules.forEach((rule) => {
    const c = rule.condition;
    // Extract domain for fast lookup
    if (c.urlFilter) {
      const clean = c.urlFilter.replace(/^\|\|/, "").replace(/\^/g, "");
      const match = clean.match(domainRegex);
      if (match && match[1] && match[1].length > 3) {
        const key = match[1].toLowerCase();
        if (!ruleIndex.domainMap.has(key)) ruleIndex.domainMap.set(key, []);
        ruleIndex.domainMap.get(key).push(rule);
        return;
      }
    }
    ruleIndex.genericRules.push(rule);
  });
}

function findMatchingRule(url, initiatorType) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const parts = hostname.split(".");

    // Map performance types to DNR types
    const typeMap = {
      script: "script",
      img: "image",
      xmlhttprequest: "xmlhttprequest",
      fetch: "xmlhttprequest",
      sub_frame: "sub_frame",
      iframe: "sub_frame",
    };
    const reqType = typeMap[initiatorType] || "other";

    // Helper to check a specific list of rules
    const check = (list) =>
      list.find((r) => {
        const c = r.condition;
        if (c.resourceTypes && !c.resourceTypes.includes(reqType)) return false;
        if (c.urlFilter) {
          const pattern = c.urlFilter.replace(/^\|\|/, ""); // Simple cleanup
          if (!url.includes(pattern)) return false;
        }
        return true;
      });

    // 1. Check Domain Map (iterating subdomains)
    while (parts.length > 1) {
      const domain = parts.join(".");
      if (ruleIndex.domainMap.has(domain)) {
        const match = check(ruleIndex.domainMap.get(domain));
        if (match) return match;
      }
      parts.shift();
    }

    // 2. Check Generic Rules
    return check(ruleIndex.genericRules);
  } catch (e) {
    return null;
  }
}

// Clear logs when tab closes (optional)
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabLog(tabId);
});

// Check if the Debug API is available (Developer Mode)
const isDebugAvailable = !!(
  chrome.declarativeNetRequest.onRuleMatchedDebug &&
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener
);
// Listen for new tabs or reloads to inform content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(changeInfo, tab, "changeInfo");
  if (changeInfo.status !== "complete") return;
  if (!tab.url || tab.url.startsWith("chrome")) return;

  chrome.tabs
    .sendMessage(tabId, {
      type: "DNR_STATUS_UPDATE",
      useSimulatedMode: !isDebugAvailable, // If Debug is FALSE, use Simulation (True)
    })
    .catch(() => {}); // Ignore errors if content script isn't ready

  // chrome tab security
  checkUrlWithSafeBrowsing(tab.url).then((unsafe) => {
    if (!unsafe) return;

    chrome.tabs
      .sendMessage(tabId, {
        type: "UNSAFE_TAB_URL",
      })
      .catch((e) => {
        console.log(e);
      });
  });
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

    if (msg.type === "DNR_LOG_CLEAR") {
      if (tabId === null) await clearAllLogs();
      else await clearTabLog(tabId);
      sendResponse({ ok: true });
      return;
    }

    // if (msg.type === "DNR_SNAPSHOT") {
    //   // need to be worked on. Might work in production
    //   const minTimeStamp = msg.minTimeStamp ?? Date.now() - 60_000;

    //   if (tabId === null) await snapshotAllTabs(minTimeStamp);
    //   else await snapshotMatches(tabId, minTimeStamp);

    //   sendResponse({ ok: true });
    //   return;
    // }
    if (msg.type === "GET_DNR_STATUS") {
      sendResponse({ useSimulatedMode: !isDebugAvailable });
    }

    if (
      msg.type === "DNR_MATCH_BATCH" &&
      !chrome.declarativeNetRequest.onRuleMatchedDebug
    ) {
      console.log(1);
      const contentTabId = sender.tab ? sender.tab.id : tabId;

      msg.items.forEach(async (item) => {
        const rule = findMatchingRule(item.url, item.type);

        // Only log if we found a matching rule in our blocklist
        if (rule) {
          await appendLog(contentTabId, {
            ts: item.ts,
            source: "content_script", // Distinct source tag
            tabId: contentTabId,
            url: item.url,
            method: "GET", // Performance API doesn't allow seeing method, assume GET
            type: item.type,
            initiator: item.initiator, // <-
            ruleId: rule.id,
            rulesetId: "ruleset_1",
            action: "block",
          });
        }
      });
    }
  })().catch((err) => sendResponse({ ok: false, error: String(err) }));

  return true; // keep the message channel open for async response
});

chrome.runtime.onInstalled.addListener(async function (object) {
  // chrome.storage.local.clear();
  rebuildActionCache().catch(() => {});
  chrome.storage.local.set({ paused: false });

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
});
