import { initRuleManager } from "./rulemanager";
import { initOptionsNavigation } from "./navigation";
import { initDashboard } from "./dashboard";
import { initCookies } from "./cookies";

document.addEventListener("DOMContentLoaded", () => {
  initRuleManager();
  initDashboard();
  initCookies();
  initOptionsNavigation();
});
