export const $ = (id) => document.getElementById(id);

// need to move the custom blocklist elements here
export const els = {
  windowMs: $("windowMs"),
  openSettings: $("open-settings"),

  // request viewer
  scope: $("scope"),
  search: $("search"),
  autoRefresh: $("autoRefresh"),
  refresh: $("refresh"),
  clear: $("clear"),
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

  // Cookie viewer elements
  domainFilter: $("domainFilter"),
  refreshCookies: $("refreshCookies"),
  cookieCount: $("cookieCount"),
  cookieTableBody: $("cookieTableBody"),
  statusText: $("statusText"),

  // Extension Analysis
  extensionIdInput: $("extension-id-inp"),
  extAnalyzeBtn: $("ext-analyze-btn"),
  downloadExtSourceCode: $("download-ext-code"),
  extAnalysisOutput: $("output"),
};
