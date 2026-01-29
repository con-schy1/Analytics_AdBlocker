import { initRuleManager } from "./rulemanager";
import { initRequestViewer } from "./request_viewer";
import { initExtensionAnalysis } from "./extension_analysis";
import { initCookies } from "./cookies";
import { initOptionsNavigation } from "./navigation";

document.addEventListener("DOMContentLoaded", () => {
  initRuleManager();
  initRequestViewer();
  initExtensionAnalysis();
  initCookies();
  initOptionsNavigation();
});
