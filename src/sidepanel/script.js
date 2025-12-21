const els = {
  domainFilter: document.getElementById("domainFilter"),
  refreshCookies: document.getElementById("refreshCookies"),
  cookieCount: document.getElementById("cookieCount"),
  cookieTableBody: document.getElementById("cookieTableBody"),
  statusText: document.getElementById("statusText"),
};

let allCookies = [];
let currentTabId = null;

function escapeHtml(str) {
  return String(str ?? "").replace(
    /([&<>"'])/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[m],
  );
}

function formatExpires(cookie) {
  if (!cookie.expirationDate) return "Session";
  const date = new Date(cookie.expirationDate * 1000);
  const now = Date.now();
  const diff = cookie.expirationDate * 1000 - now;
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString();
  }
  return date.toLocaleDateString();
}

function renderCookies(cookies) {
  els.cookieCount.textContent = cookies.length;
  els.cookieTableBody.innerHTML = cookies
    .map(
      (cookie) => `
      <tr>
        <td title="${escapeHtml(cookie.domain)}">${escapeHtml(cookie.domain)}</td>
        <td title="${escapeHtml(cookie.name)}">${escapeHtml(cookie.name)}</td>
        <td title="${escapeHtml(cookie.value)}">${escapeHtml(cookie.value.slice(0, 50))}${cookie.value.length > 50 ? "..." : ""}</td>
        <td>${escapeHtml(cookie.path)}</td>
        <td title="${formatExpires(cookie)}">${formatExpires(cookie)}</td>
        <td>${cookie.secure ? "✓" : ""}</td>
        <td>${cookie.httpOnly ? "✓" : ""}</td>
      </tr>
    `,
    )
    .join("");
}

function filterCookies() {
  const query = els.domainFilter.value.toLowerCase();
  const filtered = allCookies.filter((cookie) => {
    if (query && !cookie.domain.toLowerCase().includes(query)) return false;
    return true;
  });
  renderCookies(filtered);
}

async function loadCookies() {
  try {
    els.statusText.textContent = "Loading cookies...";

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    console.log(tab);
    if (!tab.url) return;

    const domain = new URL(tab.url).hostname;

    // 1. Request permission for this specific domain only
    const perms = await new Promise((resolve) => {
      chrome.permissions.request(
        { origins: [`https://${domain}/*`, `http://${domain}/*`] },
        resolve,
      );
    });
    if (!perms) {
      els.statusText.textContent = "Permission denied";
      return;
    }

    // 2. Get cookies for this domain + common 3rd-parties
    const domains = [
      tab.url,
      `https://${domain}/*`, // HTTPS version
      `http://${domain}/*`, // HTTP fallback
      // Add common trackers your extension blocks
      "https://google-analytics.com/*",
      "https://doubleclick.net/*",
    ];

    allCookies = [];
    for (const url of domains) {
      try {
        const cookies = await new Promise((resolve) => {
          chrome.cookies.getAll({ url }, resolve);
        });
        allCookies.push(...cookies);
      } catch (e) {
        // Ignore permission errors for 3rd parties
      }
    }

    // Deduplicate
    allCookies = Array.from(
      new Map(allCookies.map((c) => [`${c.name}-${c.domain}`, c])).values(),
    );

    filterCookies();
    els.statusText.textContent = `Loaded ${allCookies.length} cookies`;
  } catch (e) {
    els.statusText.textContent = "Error loading cookies";
    console.error(e);
  }
}

// Event listeners
els.refreshCookies.addEventListener("click", loadCookies);
els.domainFilter.addEventListener("input", filterCookies);

// Initial load
loadCookies();

// Listen for tab changes from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "UPDATE_TAB") {
    currentTabId = msg.tabId;
    loadCookies();
  }
});
