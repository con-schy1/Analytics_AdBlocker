import { els } from "./dom";
import { escapeHtml } from "./utils";

let allCookies = [];

/* =========================
   Public entry
========================= */

export function initCookies() {
  if (els.refreshCookies) {
    els.refreshCookies.addEventListener("click", loadCookies);
  }
  if (els.domainFilter) {
    els.domainFilter.addEventListener("input", filterCookies);
  }
}

export function refreshCookies() {
  loadCookies();
}

/* =========================
   Helpers
========================= */

function formatExpires(cookie) {
  if (!cookie.expirationDate) return "Session";
  const date = new Date(cookie.expirationDate * 1000);
  const diff = cookie.expirationDate * 1000 - Date.now();
  return diff < 86400000
    ? date.toLocaleTimeString()
    : date.toLocaleDateString();
}

function isStrictBase64(str) {
  const knownWords = ["false", "true", "True", "False"];
  if (typeof str !== "string" || !str.length) return false;
  if (/\s/.test(str)) return false;
  if (str.length % 4 !== 0) return false;
  if (knownWords.includes(str)) return false;

  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
    str,
  );
}

function truncateValue(s, n = 50) {
  s = String(s ?? "");
  return s.length > n ? s.slice(0, n) + "..." : s;
}

function decodeBase64Utf8(b64) {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* =========================
   Rendering
========================= */

function renderCookies(cookies) {
  if (!els.cookieCount || !els.cookieTableBody) return;

  els.cookieCount.textContent = cookies.length;

  els.cookieTableBody.innerHTML = cookies
    .map((cookie) => {
      const fullVal = String(cookie.value ?? "");
      const shortVal = truncateValue(fullVal);
      const canDecode = isStrictBase64(fullVal);

      return `
        <tr>
          <td title="${escapeHtml(cookie.domain)}">${escapeHtml(
            cookie.domain,
          )}</td>
          <td title="${escapeHtml(cookie.name)}">${escapeHtml(cookie.name)}</td>
          <td title="${escapeHtml(fullVal)}">
            <div style="display:flex;gap:10px;min-width:0;">
              <span class="cookieValueText" data-full="${escapeHtml(
                fullVal,
              )}">${escapeHtml(shortVal)}</span>
              <button class="btn btnSmall" data-copycookie>Copy</button>
              ${
                canDecode
                  ? `<button class="btn btnSmall" data-decode="${escapeHtml(
                      fullVal,
                    )}">Decode</button>`
                  : ""
              }
            </div>
          </td>
          <td>${escapeHtml(cookie.path)}</td>
          <td title="${formatExpires(cookie)}">${formatExpires(cookie)}</td>
          <td>${cookie.secure ? "✅" : ""}</td>
          <td>${cookie.httpOnly ? "✅" : ""}</td>
        </tr>
      `;
    })
    .join("");

  bindRowActions();
}

function bindRowActions() {
  els.cookieTableBody.querySelectorAll("button[data-decode]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      try {
        const decoded = decodeBase64Utf8(btn.getAttribute("data-decode"));
        const td = btn.closest("td");
        const span = td.querySelector(".cookieValueText");

        span.textContent = truncateValue(decoded);
        span.dataset.full = decoded;
        td.title = decoded;
        btn.disabled = true;
      } catch {}
    });
  });

  els.cookieTableBody
    .querySelectorAll("button[data-copycookie]")
    .forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        const span = btn.closest("td").querySelector(".cookieValueText");
        const value = span.dataset.full || span.textContent || "";
        await navigator.clipboard.writeText(value);
      });
    });
}

/* =========================
   Filtering and loading
========================= */

function filterCookies() {
  const q = els.domainFilter.value.toLowerCase();
  renderCookies(
    allCookies.filter((c) => !q || c.domain.toLowerCase().includes(q)),
  );
}

async function loadCookies() {
  allCookies = [];
  els.cookieTableBody.innerHTML = "";
  try {
    els.statusText.textContent = "Loading all cookies...";

    const hasPermission = await new Promise((resolve) =>
      chrome.permissions.contains(
        { permissions: ["cookies"], origins: ["<all_urls>"] },
        resolve,
      ),
    );

    if (!hasPermission) {
      const granted = await new Promise((resolve) =>
        chrome.permissions.request(
          { permissions: ["cookies"], origins: ["<all_urls>"] },
          resolve,
        ),
      );

      if (!granted) {
        els.statusText.textContent =
          "Permission denied - Need cookies + all_urls";
        return;
      }
    }

    allCookies = await new Promise((resolve) =>
      chrome.cookies.getAll({}, resolve),
    );

    allCookies = Array.from(
      new Map(allCookies.map((c) => [`${c.name}-${c.domain}`, c])).values(),
    );

    const tabId = getActiveTabIdFromUrl();
    if (tabId) {
      const tab = await chrome.tabs.get(tabId);
      if (tab?.url) {
        els.domainFilter.value = new URL(tab.url).hostname;
      }
    }

    filterCookies();
    els.statusText.textContent = `Loaded ${allCookies.length} cookies`;
  } catch (e) {
    console.error(e);
    els.statusText.textContent = "Error loading cookies";
  }
}

/* =========================
   Utils
========================= */

function getActiveTabIdFromUrl() {
  const raw = new URLSearchParams(location.search).get("activeTabId");
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
