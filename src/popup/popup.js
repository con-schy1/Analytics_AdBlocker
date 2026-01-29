// This code is protected under Apache-2.0 license

// Reserved IDs for global toggles (must match background/options)
const GLOBAL_JS_RULE_ID = 9000001;
const GLOBAL_IMG_RULE_ID = 9000002;
const GLOBAL_VIDEO_RULE_ID = 9000003;
const GLOBAL_COOKIES_RULE_ID = 9000004;

document.addEventListener("DOMContentLoaded", async () => {
  const pauseBtn = document.getElementById("pause");
  const resumeBtn = document.getElementById("resume");
  const statusAnim = document.getElementById("status-anim");
  const blockedText = document.getElementById("blocked");

  const jsBtn = document.getElementById("toggle-js");
  const imgBtn = document.getElementById("toggle-images");
  const videoBtn = document.getElementById("toggle-videos");
  const cookiesBtn = document.getElementById("toggle-cookies");

  // ----- Init paused state -----
  const pausedData = await chrome.storage.local.get("paused");
  const isPaused = !!pausedData.paused;

  applyPausedUI(isPaused, statusAnim, blockedText, pauseBtn, resumeBtn);
  await setBadgeFromPaused(isPaused);

  // ----- Init global toggle state -----
  const toggleStateData = await chrome.storage.local.get("globalToggles");
  console.log(toggleStateData, "toggleStateData");
  const toggles = toggleStateData.globalToggles || {
    js: false,
    images: false,
    videos: false,
    cookies: false,
  };

  setToggleVisual(jsBtn, toggles.js);
  setToggleVisual(imgBtn, toggles.images);
  setToggleVisual(videoBtn, toggles.videos);
  setToggleVisual(cookiesBtn, toggles.cookies);

  // Ensure rules reflect stored state
  await syncGlobalRulesWithState(toggles);

  // ----- Pause / Resume buttons -----
  pauseBtn.addEventListener("click", async () => {
    applyPausedUI(true, statusAnim, blockedText, pauseBtn, resumeBtn);
    await chrome.storage.local.set({ paused: true });

    await setBadgeFromPaused(true); // <- add this

    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ["ruleset_1"],
    });

    reloadActiveTab();
  });

  resumeBtn.addEventListener("click", async () => {
    applyPausedUI(false, statusAnim, blockedText, pauseBtn, resumeBtn);
    await chrome.storage.local.set({ paused: false });

    await setBadgeFromPaused(false); // <- add this

    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ["ruleset_1"],
    });

    reloadActiveTab();
  });

  // ----- Global toggle handlers -----
  jsBtn.addEventListener("click", async () => {
    const newState = !jsBtn.classList.contains("active");
    setToggleVisual(jsBtn, newState);
    toggles.js = newState;
    await applyGlobalToggle("js", newState);
    await chrome.storage.local.set({ globalToggles: toggles });
    reloadActiveTab();
  });

  imgBtn.addEventListener("click", async () => {
    const newState = !imgBtn.classList.contains("active");
    setToggleVisual(imgBtn, newState);
    toggles.images = newState;
    await applyGlobalToggle("images", newState);
    await chrome.storage.local.set({ globalToggles: toggles });
    reloadActiveTab();
  });

  videoBtn.addEventListener("click", async () => {
    const newState = !videoBtn.classList.contains("active");
    setToggleVisual(videoBtn, newState);
    toggles.videos = newState;
    await applyGlobalToggle("videos", newState);
    await chrome.storage.local.set({ globalToggles: toggles });
    reloadActiveTab();
  });

  cookiesBtn.addEventListener("click", async () => {
    const newState = !cookiesBtn.classList.contains("active");
    setToggleVisual(cookiesBtn, newState);
    toggles.cookies = newState;
    await applyGlobalToggle("cookies", newState);
    console.log(toggles, "cook");
    await chrome.storage.local.set({ globalToggles: toggles });
    reloadActiveTab();
  });

  // // Settings button
  // document
  //   .getElementById("go-to-options")
  //   .addEventListener("click", function () {
  //     if (chrome.runtime.openOptionsPage) {
  //       chrome.runtime.openOptionsPage();
  //     } else {
  //       window.open(chrome.runtime.getURL("options.html"));
  //     }
  //   });

  // in popup.js (or options page), add a "Dashboard" button handler
  document
    .getElementById("open-dashboard")
    .addEventListener("click", async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (chrome.runtime.openOptionsPage) {
        window.open(
          chrome.runtime.getURL("options.html?activeTabId=" + tabs[0].id),
        );
      } else {
        // chrome.runtime.openOptionsPage();
        window.open(
          chrome.runtime.getURL("options.html?activeTabId=" + tabs[0].id),
        );
      }
    });
});

// ----- UI helpers -----
function applyPausedUI(isPaused, svg, blockedText, pauseBtn, resumeBtn) {
  if (isPaused) {
    svg.classList.add("status-paused");
    if (blockedText) blockedText.textContent = "Not Blocking";
    resumeBtn.style.display = "block";
    pauseBtn.style.display = "none";
  } else {
    svg.classList.remove("status-paused");
    if (blockedText) blockedText.textContent = "Blocked";
    resumeBtn.style.display = "none";
    pauseBtn.style.display = "block";
  }
}

function setToggleVisual(button, enabled) {
  if (!button) return;
  if (enabled) button.classList.add("active");
  else button.classList.remove("active");
}

async function reloadActiveTab() {
  setTimeout(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
  }, 1000);
}

// ----- DNR global rules -----
async function syncGlobalRulesWithState(state) {
  // Remove all three, then re-add active ones to keep things clean
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [
      GLOBAL_JS_RULE_ID,
      GLOBAL_IMG_RULE_ID,
      GLOBAL_VIDEO_RULE_ID,
      GLOBAL_COOKIES_RULE_ID,
    ],
  });

  const addRules = [];
  if (state.js) addRules.push(buildJsRule());
  if (state.images) addRules.push(buildImgRule());
  if (state.videos) addRules.push(buildVideoRule());
  if (state.cookies) addRules.push(buildCookiesRule());

  if (addRules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules });
  }
}

async function applyGlobalToggle(kind, enabled) {
  const removeIds = [];
  const addRules = [];

  if (kind === "js") {
    if (enabled) {
      addRules.push(buildJsRule());
    } else {
      removeIds.push(GLOBAL_JS_RULE_ID);
    }
  } else if (kind === "images") {
    if (enabled) {
      addRules.push(buildImgRule());
    } else {
      removeIds.push(GLOBAL_IMG_RULE_ID);
    }
  } else if (kind === "videos") {
    if (enabled) {
      addRules.push(buildVideoRule());
    } else {
      removeIds.push(GLOBAL_VIDEO_RULE_ID);
    }
  } else if (kind === "cookies") {
    if (enabled) {
      addRules.push(buildCookiesRule());
    } else {
      removeIds.push(GLOBAL_COOKIES_RULE_ID);
    }
  }

  if (removeIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
    });
  }
  if (addRules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules });
  }
}

// Matches ALL script requests on all sites
function buildJsRule() {
  return {
    id: GLOBAL_JS_RULE_ID,
    priority: 1,
    action: { type: "block" },
    condition: {
      // No urlFilter: matches all URLs, restricted by resourceTypes
      resourceTypes: ["script"],
    },
  };
}

// Matches ALL images
function buildImgRule() {
  return {
    id: GLOBAL_IMG_RULE_ID,
    priority: 1,
    action: { type: "block" },
    condition: {
      resourceTypes: ["image"],
    },
  };
}

// Matches ALL media/video/streaming
function buildVideoRule() {
  return {
    id: GLOBAL_VIDEO_RULE_ID,
    priority: 1,
    action: { type: "block" },
    condition: {
      resourceTypes: ["media"],
    },
  };
}

// Matches ALL media/video/streaming
function buildCookiesRule() {
  return {
    id: GLOBAL_COOKIES_RULE_ID,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "cookie",
          operation: "remove",
        },
      ],
    },
    condition: {
      resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"],
      // resourceTypes: ["xmlhttprequest", "sub_frame"],
    },
  };
}

// Badge helper: show "ON" when active, hide when paused
async function setBadgeFromPaused(paused) {
  if (paused) {
    // Empty string hides the badge
    await chrome.action.setBadgeText({ text: "" });
  } else {
    await chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
    await chrome.action.setBadgeText({ text: "ON" });
  }
}
