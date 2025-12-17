const $ = (id) => document.getElementById(id);

const els = {
  scope: $("scope"),
  windowMs: $("windowMs"),
  search: $("search"),
  autoRefresh: $("autoRefresh"),
  refresh: $("refresh"),
  clear: $("clear"),
  openSettings: $("open-settings"),
  exportJson: $("exportJson"),

  kpis: $("kpis"),
  byType: $("byType"),
  byInitiator: $("byInitiator"),
  byHost: $("byHost"),
  byRule: $("byRule"),

  typeHint: $("typeHint"),
  initHint: $("initHint"),
  hostHint: $("hostHint"),
  ruleHint: $("ruleHint"),

  count: $("count"),
  tbody: $("tbody"),
};

let lastRendered = [];
let timer = null;

function escapeHtml(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function safeHost(u) {
  try {
    return new URL(u).hostname || "";
  } catch {
    return "";
  }
}

function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function countBy(items, keyFn) {
  const map = new Map();
  for (const it of items) {
    const k = keyFn(it) || "(unknown)";
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function topNLabel(pairs, n = 3) {
  return pairs
    .slice(0, n)
    .map(([k, v]) => `${k} (${v})`)
    .join(", ");
}

function renderBars(container, pairs, topN = 8) {
  const slice = pairs.slice(0, topN);
  const max = slice.length ? slice[0][1] : 1;

  container.innerHTML =
    slice
      .map(([label, count]) => {
        const pct = max ? Math.round((count / max) * 100) : 0;
        return `
      <div class="barRow" title="${escapeHtml(label)}">
        <div class="barLabel">${escapeHtml(label)}</div>
        <div class="barCount">${count}</div>
        <div class="barTrack">
          <div class="barFill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
      })
      .join("") || `<div class="barLabel muted">No data</div>`;
}

function kpi(label, value, sub) {
  return `
    <div class="kpi">
      <div class="kpiLabel">${escapeHtml(label)}</div>
      <div class="kpiValue">${escapeHtml(value)}</div>
      <div class="kpiSub">${escapeHtml(sub || "")}</div>
    </div>
  `;
}

function renderKpis(items) {
  const total = items.length;
  const uniqDest = new Set(items.map((x) => safeHost(x.url))).size;
  const uniqInit = new Set(items.map((x) => safeHost(x.initiator))).size;
  const uniqRules = new Set(items.map((x) => String(x.ruleId))).size;

  const topDest = countBy(items, (x) => safeHost(x.url))[0];
  const topInit = countBy(items, (x) => safeHost(x.initiator))[0];
  const topRule = countBy(items, (x) => String(x.ruleId))[0];

  const lastTs = items.length ? Math.max(...items.map((x) => x.ts || 0)) : null;

  els.kpis.innerHTML = [
    kpi("Blocked", String(total), "Events in window"),
    kpi("Unique destinations", String(uniqDest), "Hosts contacted"),
    kpi("Unique initiators", String(uniqInit), "Sites initiating requests"),
    kpi(
      "Top rule",
      topRule ? String(topRule[1]) : "0",
      topRule ? `#${topRule[0]}` : "—",
    ),
    kpi(
      "Last seen",
      lastTs ? fmtTime(lastTs) : "—",
      lastTs ? new Date(lastTs).toLocaleDateString() : "",
    ),
  ].join("");

  els.typeHint.textContent = topNLabel(countBy(items, (x) => x.type));
  els.initHint.textContent = topNLabel(
    countBy(items, (x) => safeHost(x.initiator)),
  );
  els.hostHint.textContent = topNLabel(countBy(items, (x) => safeHost(x.url)));
  els.ruleHint.textContent = topNLabel(countBy(items, (x) => `#${x.ruleId}`));
}

function renderTable(items, limit = 200) {
  els.count.textContent = String(items.length);

  const rows = items.slice(0, limit);
  els.tbody.innerHTML = rows
    .map((e, idx) => {
      const initHost = safeHost(e.initiator) || e.initiator || "—";
      const destHost = safeHost(e.url) || "—";
      const time = fmtTime(e.ts || Date.now());
      const type = e.type || "other";
      const method = e.method || "";

      const detailsId = `d_${idx}_${e.ts || 0}_${e.ruleId || 0}`;

      return `
      <tr data-details="${detailsId}">
        <td>${escapeHtml(time)}</td>
        <td><span class="pill">${escapeHtml(type)}</span></td>
        <td>${escapeHtml(method)}</td>
        <td>${escapeHtml(initHost)}</td>
        <td>${escapeHtml(destHost)}</td>
        <td>${escapeHtml(String(e.ruleId ?? ""))}</td>
        <td class="colTabCell">${escapeHtml(String(e.tabId ?? ""))}</td>
      </tr>
      <tr id="${detailsId}" style="display:none;">
        <td colspan="7">
          <div class="details">
            <div><b>URL</b>: <a class="link" href="${escapeHtml(e.url)}" target="_blank" rel="noreferrer">${escapeHtml(e.url)}</a></div>
            <div><b>Initiator</b>: ${escapeHtml(e.initiator || "")}</div>
            <div><b>Ruleset</b>: ${escapeHtml(e.rulesetId || "")} &nbsp; <b>Source</b>: ${escapeHtml(e.source || "")}</div>
            <div style="margin-top:8px; display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn btnSmall" data-copy="${escapeHtml(e.url)}">Copy URL</button>
              <button class="btn btnSmall" data-copy="${escapeHtml(e.initiator || "")}">Copy Initiator</button>
            </div>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  // Expand/collapse
  els.tbody.querySelectorAll("tr[data-details]").forEach((tr) => {
    tr.addEventListener("click", () => {
      const id = tr.getAttribute("data-details");
      const row = document.getElementById(id);
      row.style.display = row.style.display === "none" ? "table-row" : "none";
    });
  });

  // Copy buttons
  els.tbody.querySelectorAll("button[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      await navigator.clipboard.writeText(btn.getAttribute("data-copy") || "");
    });
  });
}

async function getActiveTabId() {
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // return tab?.id ?? null;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get("activeTabId");
  if (!raw) return null;

  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function applyScopeUI() {
  document.body.dataset.scope = els.scope.value; // used by CSS to hide/show tab column
}

async function loadDataAndRender() {
  applyScopeUI();

  const windowMs = Number(els.windowMs.value);
  const minTimeStamp = Date.now() - windowMs;

  const tabId = els.scope.value === "active" ? await getActiveTabId() : null;

  // Ask SW to snapshot matched rules (best-effort)
  await chrome.runtime.sendMessage({
    type: "DNR_SNAPSHOT",
    tabId,
    minTimeStamp,
  });

  // Fetch logs (tab or all)
  const res = await chrome.runtime.sendMessage({
    type: "DNR_LOG_GET",
    tabId,
    minTimeStamp,
  });
  const items = (res?.items || []).slice();
  console.log(items);

  // Search filter
  const q = (els.search.value || "").trim().toLowerCase();
  const filtered = q
    ? items.filter((e) => {
        const hay =
          `${e.url} ${e.initiator} ${e.rulesetId} ${e.ruleId} ${e.type} ${e.method} ${e.tabId}`.toLowerCase();
        return hay.includes(q);
      })
    : items;

  // Sort newest first
  filtered.sort((a, b) => (b.ts || 0) - (a.ts || 0));

  lastRendered = filtered;

  renderKpis(filtered);
  renderBars(
    els.byType,
    countBy(filtered, (x) => x.type),
  );
  renderBars(
    els.byInitiator,
    countBy(filtered, (x) => safeHost(x.initiator)),
  );
  renderBars(
    els.byHost,
    countBy(filtered, (x) => safeHost(x.url)),
  );
  renderBars(
    els.byRule,
    countBy(filtered, (x) => `#${x.ruleId}`),
  );
  renderTable(filtered);
}

async function clearLogs() {
  const tabId = els.scope.value === "active" ? await getActiveTabId() : null;
  await chrome.runtime.sendMessage({ type: "DNR_LOG_CLEAR", tabId });
  await loadDataAndRender();
}

function setAutoRefresh(enabled) {
  if (timer) clearInterval(timer);
  timer = null;

  if (enabled) {
    timer = setInterval(loadDataAndRender, 2000);
  }
}

els.refresh.addEventListener("click", loadDataAndRender);
els.clear.addEventListener("click", clearLogs);

els.scope.addEventListener("change", async () => {
  applyScopeUI();
  await loadDataAndRender();
});
els.windowMs.addEventListener("change", loadDataAndRender);

els.search.addEventListener("input", () => {
  // quick debounce
  clearTimeout(window.__t);
  window.__t = setTimeout(loadDataAndRender, 150);
});

els.autoRefresh.addEventListener("change", () => {
  setAutoRefresh(els.autoRefresh.checked);
});

els.exportJson.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(lastRendered, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dnr-blocked-events.json";
  a.click();
  URL.revokeObjectURL(url);
});

// initial
applyScopeUI();
loadDataAndRender();
