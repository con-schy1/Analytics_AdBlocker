// This code is protected under Apache-2.0 license

// --- RULE MANAGEMENT ---
let currentRuleType = "domain";

const GLOBAL_JS_RULE_ID = 9000001;
const GLOBAL_IMG_RULE_ID = 9000002;
const GLOBAL_VIDEO_RULE_ID = 9000003;
const RESERVED_IDS = [
  GLOBAL_JS_RULE_ID,
  GLOBAL_IMG_RULE_ID,
  GLOBAL_VIDEO_RULE_ID,
];

// Toggle inputs based on selection
document.getElementById("rule-type").addEventListener("change", (e) => {
  currentRuleType = e.target.value;

  const domainGroup = document.getElementById("domain-input-group");
  const regexGroup = document.getElementById("regex-input-group");

  // "regex" is the only advanced input.
  // "domain", "ads", and "analytics" all use the simple domain input field.
  if (currentRuleType === "regex") {
    domainGroup.classList.add("hidden");
    regexGroup.classList.remove("hidden");
  } else {
    domainGroup.classList.remove("hidden");
    regexGroup.classList.add("hidden");
  }
});

// Add Rule Button
document.getElementById("add-rule-btn").addEventListener("click", async () => {
  let pattern = "";
  let ruleType = currentRuleType;

  if (ruleType === "regex") {
    pattern = document.getElementById("regex-input").value.trim();
    if (!pattern) {
      alert("Please enter a regex pattern");
      return;
    }
  } else {
    // Domain, Ads, or Analytics
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

    // Clear input
    if (ruleType === "regex") {
      document.getElementById("regex-input").value = "";
    } else {
      document.getElementById("domain-input").value = "";
    }

    loadCustomRules();
  } catch (error) {
    alert("Error adding rule: " + error.message);
  }
});

// Add Block Rule Function
async function addBlockRule(pattern, type) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const usedIds = existingRules.map((r) => r.id).concat(RESERVED_IDS);

  let nextId = 1;
  while (usedIds.includes(nextId)) {
    nextId += 1;
  }
  let condition = {};
  let resourceTypes = [];

  // Define resource types based on the selected rule mode
  switch (type) {
    case "domain":
      // BLOCK EVERYTHING
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
      condition = {
        urlFilter: `||${pattern}`,
        resourceTypes: resourceTypes,
      };
      break;

    case "ads":
      // Block common ad delivery mechanisms
      resourceTypes = [
        "sub_frame",
        "script",
        "xmlhttprequest",
        "image",
        "object",
      ];
      condition = {
        urlFilter: `||${pattern}`,
        resourceTypes: resourceTypes,
      };
      break;

    case "analytics":
      // Block tracking mechanisms (pixels, scripts, pings)
      resourceTypes = ["script", "image", "xmlhttprequest", "ping"];
      condition = {
        urlFilter: `||${pattern}`,
        resourceTypes: resourceTypes,
      };
      break;

    case "regex":
      // Advanced regex (usually for scripts/frames)
      resourceTypes = ["script", "xmlhttprequest", "sub_frame"];
      condition = {
        regexFilter: pattern,
        resourceTypes: resourceTypes,
      };
      break;
  }

  const newRule = {
    id: nextId,
    priority: 1,
    action: { type: "block" },
    condition: condition,
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [newRule],
  });

  // Store metadata
  let metadata = (await chrome.storage.local.get("ruleMetadata")) || {
    ruleMetadata: {},
  };
  if (!metadata.ruleMetadata) metadata.ruleMetadata = {};

  metadata.ruleMetadata[nextId] = {
    pattern: pattern,
    type: type,
    addedAt: Date.now(),
  };

  await chrome.storage.local.set({ ruleMetadata: metadata.ruleMetadata });
}

// Load and Display Custom Rules
async function loadCustomRules() {
  const allRules = await chrome.declarativeNetRequest.getDynamicRules();
  // --- FILTER OUT GLOBAL RULES ---
  const rules = allRules.filter((rule) => !RESERVED_IDS.includes(rule.id));

  const metadata = await chrome.storage.local.get("ruleMetadata");
  const ruleMetadata = metadata.ruleMetadata || {};

  const container = document.getElementById("rules-list");
  const countBadge = document.getElementById("rule-count");

  countBadge.innerText = `${rules.length} rules`;
  container.innerHTML = "";

  if (rules.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerText = "No custom rules yet. Add your first rule above.";
    container.appendChild(emptyState);
    return;
  }

  rules.forEach((rule) => {
    const meta = ruleMetadata[rule.id] || {
      pattern: "Unknown",
      type: "domain",
    };

    // Determine badge color/label
    let typeLabel = "Domain";
    let typeBadge = "badge-domain";

    if (meta.type === "regex") {
      typeLabel = "Regex";
      typeBadge = "badge-regex";
    } else if (meta.type === "ads") {
      typeLabel = "Ad Server";
      typeBadge = "badge-ads"; // You can style this yellow/orange
    } else if (meta.type === "analytics") {
      typeLabel = "Analytics";
      typeBadge = "badge-analytics"; // You can style this purple/blue
    }

    // Create Elements
    const ruleItem = document.createElement("div");
    ruleItem.className = "rule-item";

    const ruleInfo = document.createElement("div");
    ruleInfo.className = "rule-info";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = `badge ${typeBadge}`;
    badgeSpan.innerText = typeLabel;

    const patternSpan = document.createElement("span");
    patternSpan.className = "rule-pattern";
    patternSpan.innerText = meta.pattern;

    ruleInfo.appendChild(badgeSpan);
    ruleInfo.appendChild(patternSpan);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-remove";
    removeBtn.innerText = "Remove";
    removeBtn.addEventListener("click", () => {
      removeRule(rule.id);
    });

    ruleItem.appendChild(ruleInfo);
    ruleItem.appendChild(removeBtn);
    container.appendChild(ruleItem);
  });
}

// Remove Rule
window.removeRule = async function (ruleId) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ruleId],
  });

  let metadata = await chrome.storage.local.get("ruleMetadata");
  if (metadata.ruleMetadata && metadata.ruleMetadata[ruleId]) {
    delete metadata.ruleMetadata[ruleId];
    await chrome.storage.local.set({ ruleMetadata: metadata.ruleMetadata });
  }

  loadCustomRules();
};

// --- NAVIGATION LOGIC (Add this back) ---
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    // 1. Update Sidebar Active State
    document
      .querySelectorAll(".nav-item")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 2. Hide All Views
    document
      .querySelectorAll(".view-section")
      .forEach((v) => v.classList.add("hidden"));
    document
      .querySelectorAll(".view-section")
      .forEach((v) => v.classList.remove("active"));

    // 3. Show Target View
    const tabId = btn.getAttribute("data-tab");
    const targetView = document.getElementById(`view-${tabId}`);

    if (targetView) {
      targetView.classList.remove("hidden");
      targetView.classList.add("active");
    }

    // 4. Update Header Title
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      // Set title based on tab
      if (tabId === "blocklist") pageTitle.innerText = "Custom Blocklist";
      if (tabId === "about") pageTitle.innerText = "About AdShield";
    }
  });
});

// / Check for URL params to set active tab
const urlParams = new URLSearchParams(window.location.search);
const tabParam = urlParams.get("tab");

if (tabParam === "about") {
  // Simulate click on About tab
  const aboutBtn = document.querySelector('.nav-item[data-tab="about"]');
  if (aboutBtn) aboutBtn.click();
} else {
  // Default load behavior
  loadCustomRules();
}
