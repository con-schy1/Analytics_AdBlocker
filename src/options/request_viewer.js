import { els } from "./dom";
import { escapeHtml, safeHost, fmtTime, countBy } from "./utils";

let lastRendered = [];
let timer = null;

export function initRequestViewer() {
  if (!els.refresh || !els.scope) return;

  applyScopeUI();
  bindEvents();
  loadDataAndRender();
}

export function refreshRequestViewer() {
  loadDataAndRender();
}

/* =========================
   Core helpers
========================= */

function applyScopeUI() {
  if (!els.scope) return;
  document.body.dataset.scope = els.scope.value;
}

function topNLabel(pairs, n = 3) {
  return pairs
    .slice(0, n)
    .map(([k, v]) => `${k} (${v})`)
    .join(", ");
}

/* =========================
   Rendering
========================= */

function renderBars(container, pairs, topN = 8) {
  if (!container) return;

  const slice = pairs.slice(0, topN);
  const max = slice.length ? slice[0][1] : 1;

  container.innerHTML = slice
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
    .join("");

  if (!slice.length) {
    container.innerHTML = '<div class="barLabel muted">No data</div>';
  }
}

function kpi(label, value, sub) {
  return `
    <div class="kpi">
      <div class="kpiLabel">${escapeHtml(label)}</div>
      <div class="kpiValue">${escapeHtml(value)}</div>
      <div class="kpiSub">${escapeHtml(sub)}</div>
    </div>
  `;
}

function renderKpis(items) {
  if (!els.kpis) return;

  const total = items.length;
  const uniqDest = new Set(items.map((x) => safeHost(x.url))).size;
  const uniqInit = new Set(items.map((x) => safeHost(x.initiator))).size;
  const topRule = countBy(items, (x) => String(x.ruleId))[0];
  const lastTs = items.length ? Math.max(...items.map((x) => x.ts || 0)) : null;

  els.kpis.innerHTML = [
    kpi("Blocked", total, "Events in window"),
    kpi("Unique destinations", uniqDest, "Hosts contacted"),
    kpi("Unique initiators", uniqInit, "Sites initiating requests"),
    kpi("Top rule", topRule ? topRule[1] : "–", topRule ? topRule[0] : "–"),
    kpi(
      "Last seen",
      lastTs ? fmtTime(lastTs) : "–",
      lastTs ? new Date(lastTs).toLocaleDateString() : "–",
    ),
  ].join("");

  els.typeHint.textContent = topNLabel(countBy(items, (x) => x.type));
  els.initHint.textContent = topNLabel(
    countBy(items, (x) => safeHost(x.initiator)),
  );
  els.hostHint.textContent = topNLabel(countBy(items, (x) => safeHost(x.url)));
  els.ruleHint.textContent = topNLabel(countBy(items, (x) => x.ruleId));
}

function renderTable(items, limit = 200) {
  if (!els.tbody || !els.count) return;

  els.count.textContent = String(items.length);

  els.tbody.innerHTML = items
    .slice(0, limit)
    .map((e, idx) => {
      const id = `d${idx}${e.ts || 0}${e.ruleId || 0}`;
      return `
        <tr data-details="${id}">
          <td>${fmtTime(e.ts || Date.now())}</td>
          <td><span class="pill">${escapeHtml(e.type || "")}</span></td>
          <td>${escapeHtml(e.method || "")}</td>
          <td>${escapeHtml(safeHost(e.initiator) || e.initiator)}</td>
          <td>${escapeHtml(safeHost(e.url))}</td>
          <td>${escapeHtml(String(e.ruleId ?? ""))}</td>
          <td class="colTabCell">${escapeHtml(String(e.tabId ?? ""))}</td>
        </tr>
        <tr id="${id}" style="display:none">
          <td colspan="7">
            <div class="details">
              <div><b>URL:</b> ${escapeHtml(e.url)}</div>
              <div><b>Initiator:</b> ${escapeHtml(e.initiator)}</div>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  els.tbody.querySelectorAll("tr[data-details]").forEach((tr) => {
    tr.addEventListener("click", () => {
      const row = document.getElementById(tr.dataset.details);
      if (!row) return;
      row.style.display = row.style.display === "none" ? "table-row" : "none";
    });
  });
}

/* =========================
   Data
========================= */

async function loadDataAndRender() {
  if (!els.windowMs || !els.scope) return;

  applyScopeUI();

  const minTimeStamp = Date.now() - Number(els.windowMs.value);

  const tabId =
    els.scope.value === "active" ? await getActiveTabIdFromUrl() : null;

  const res = await chrome.runtime.sendMessage({
    type: "DNR_LOG_GET",
    tabId,
    minTimeStamp,
  });

  const items = res?.items || [];
  const q = els.search?.value.trim().toLowerCase() || "";

  const filtered = q
    ? items.filter((e) =>
        [e.url, e.initiator, e.rulesetId, e.ruleId, e.type, e.method, e.tabId]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : items;

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
    countBy(filtered, (x) => x.ruleId),
  );
  renderTable(filtered);
}

/* =========================
   Events
========================= */

function bindEvents() {
  els.refresh?.addEventListener("click", loadDataAndRender);
  els.clear?.addEventListener("click", clearLogs);
  els.scope?.addEventListener("change", loadDataAndRender);
  els.windowMs?.addEventListener("change", loadDataAndRender);
  els.search?.addEventListener("input", debounce(loadDataAndRender, 150));
  els.autoRefresh?.addEventListener("change", () =>
    setAutoRefresh(els.autoRefresh.checked),
  );
  els.exportJson?.addEventListener("click", exportJson);
}

/* =========================
   Utilities
========================= */

function debounce(fn, ms) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

async function clearLogs() {
  const tabId =
    els.scope.value === "active" ? await getActiveTabIdFromUrl() : null;

  await chrome.runtime.sendMessage({
    type: "DNR_LOG_CLEAR",
    tabId,
  });
  loadDataAndRender();
}

function setAutoRefresh(enabled) {
  if (timer) clearInterval(timer);
  if (enabled) {
    timer = setInterval(loadDataAndRender, 2000);
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(lastRendered, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dnr-blocked-events.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function getActiveTabIdFromUrl() {
  const raw = new URLSearchParams(location.search).get("activeTabId");
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}
