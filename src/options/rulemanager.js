// Apache-2.0 license

let currentRuleType = "domain";

const GLOBAL_JS_RULE_ID = 9000001;
const GLOBAL_IMG_RULE_ID = 9000002;
const GLOBAL_VIDEO_RULE_ID = 9000003;
const GLOBAL_COOKIE_RULE_ID = 9000004;

const RESERVED_IDS = [
  GLOBAL_JS_RULE_ID,
  GLOBAL_IMG_RULE_ID,
  GLOBAL_VIDEO_RULE_ID,
  GLOBAL_COOKIE_RULE_ID,
];

export function initRuleManager() {
  const ruleTypeSelect = document.getElementById("rule-type");
  const addRuleBtn = document.getElementById("add-rule-btn");

  ruleTypeSelect.addEventListener("change", onRuleTypeChange);
  addRuleBtn.addEventListener("click", onAddRule);

  loadCustomRules();
}

/* -------------------------
   UI handlers
------------------------- */

function onRuleTypeChange(e) {
  currentRuleType = e.target.value;

  const domainGroup = document.getElementById("domain-input-group");
  const regexGroup = document.getElementById("regex-input-group");

  if (currentRuleType === "regex") {
    domainGroup.classList.add("hidden");
    regexGroup.classList.remove("hidden");
  } else {
    domainGroup.classList.remove("hidden");
    regexGroup.classList.add("hidden");
  }
}

async function onAddRule() {
  let pattern = "";
  const ruleType = currentRuleType;

  if (ruleType === "regex") {
    pattern = document.getElementById("regex-input").value.trim();
    if (!pattern) {
      alert("Please enter a regex pattern");
      return;
    }
  } else {
    pattern = document.getElementById("domain-input").value.trim();
    if (!pattern) {
      alert("Please enter a domain");
      return;
    }
    if (pattern.includes("://") || pattern.includes(" ")) {
      alert("Enter only the domain (e.g., ads.example.com)");
      return;
    }
  }

  try {
    await addBlockRule(pattern, ruleType);

    if (ruleType === "regex") {
      document.getElementById("regex-input").value = "";
    } else {
      document.getElementById("domain-input").value = "";
    }

    loadCustomRules();
  } catch (error) {
    alert("Error adding rule: " + error.message);
  }
}

/* -------------------------
   Core rule logic
------------------------- */

async function addBlockRule(pattern, type) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();

  const usedIds = existingRules.map((r) => r.id).concat(RESERVED_IDS);

  let nextId = 1;
  while (usedIds.includes(nextId)) nextId++;

  let resourceTypes = [];
  let condition = {};

  switch (type) {
    case "domain":
      resourceTypes = [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "other",
      ];
      condition = { urlFilter: `||${pattern}`, resourceTypes };
      break;

    case "ads":
      resourceTypes = [
        "sub_frame",
        "script",
        "xmlhttprequest",
        "image",
        "object",
      ];
      condition = { urlFilter: `||${pattern}`, resourceTypes };
      break;

    case "analytics":
      resourceTypes = ["script", "image", "xmlhttprequest", "ping"];
      condition = { urlFilter: `||${pattern}`, resourceTypes };
      break;

    case "regex":
      resourceTypes = ["script", "xmlhttprequest", "sub_frame"];
      condition = { regexFilter: pattern, resourceTypes };
      break;
  }

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: nextId,
        priority: 1,
        action: { type: "block" },
        condition,
      },
    ],
  });

  const stored = await chrome.storage.local.get("ruleMetadata");
  const ruleMetadata = stored.ruleMetadata || {};

  ruleMetadata[nextId] = {
    pattern,
    type,
    addedAt: Date.now(),
  };

  await chrome.storage.local.set({ ruleMetadata });
}

async function loadCustomRules() {
  const allRules = await chrome.declarativeNetRequest.getDynamicRules();
  console.log(allRules, "allrules");

  const rules = allRules.filter((rule) => !RESERVED_IDS.includes(rule.id));

  const { ruleMetadata = {} } = await chrome.storage.local.get("ruleMetadata");

  const container = document.getElementById("rules-list");
  const countBadge = document.getElementById("rule-count");

  countBadge.innerText = `${rules.length} rules`;
  container.innerHTML = "";

  if (!rules.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerText = "No custom rules yet. Add your first rule above.";
    container.appendChild(empty);
    return;
  }

  for (const rule of rules) {
    const meta = ruleMetadata[rule.id] || {
      pattern: "Unknown",
      type: "domain",
    };

    const { label, badge } = mapRuleType(meta.type);

    const item = document.createElement("div");
    item.className = "rule-item";

    const info = document.createElement("div");
    info.className = "rule-info";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = `badge ${badge}`;
    badgeSpan.innerText = label;

    const patternSpan = document.createElement("span");
    patternSpan.className = "rule-pattern";
    patternSpan.innerText = meta.pattern;

    info.append(badgeSpan, patternSpan);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-remove";
    removeBtn.innerText = "Remove";
    removeBtn.addEventListener("click", () => removeRule(rule.id));

    item.append(info, removeBtn);
    container.appendChild(item);
  }
}

async function removeRule(ruleId) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ruleId],
  });

  const stored = await chrome.storage.local.get("ruleMetadata");
  if (stored.ruleMetadata?.[ruleId]) {
    delete stored.ruleMetadata[ruleId];
    await chrome.storage.local.set({
      ruleMetadata: stored.ruleMetadata,
    });
  }

  loadCustomRules();
}

/* -------------------------
   Helpers
------------------------- */

function mapRuleType(type) {
  if (type === "regex") {
    return { label: "Regex", badge: "badge-regex" };
  }
  if (type === "ads") {
    return { label: "Ad Server", badge: "badge-ads" };
  }
  if (type === "analytics") {
    return { label: "Analytics", badge: "badge-analytics" };
  }
  return { label: "Domain", badge: "badge-domain" };
}
