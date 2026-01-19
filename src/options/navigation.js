import { refreshDashboard } from "./dashboard";
import { refreshCookies } from "./cookies";

export function initOptionsNavigation() {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      if (!view) return;

      // Update sidebar active state
      document
        .querySelectorAll(".nav-item")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Hide all views
      document.querySelectorAll(".view-section").forEach((v) => {
        v.classList.add("hidden");
        v.classList.remove("active");
      });

      // Show target view
      const target = document.getElementById(`view-${view}`);
      if (!target) {
        console.warn("Missing view:", view);
        return;
      }

      target.classList.remove("hidden");
      target.classList.add("active");

      // Lazy load
      if (view === "dashboard") {
        refreshDashboard();
      } else if (view === "cookies") {
        refreshCookies();
      }
    });
  });
}
