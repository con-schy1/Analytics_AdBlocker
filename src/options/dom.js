export const $ = (id) => document.getElementById(id);

export const els = {
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

  // Cookie viewer elements
  domainFilter: $("domainFilter"),
  refreshCookies: $("refreshCookies"),
  cookieCount: $("cookieCount"),
  cookieTableBody: $("cookieTableBody"),
  statusText: $("statusText"),
};
