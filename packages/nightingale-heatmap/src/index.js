import NightingaleHeatmap from "./nightingale-heatmap";

const loadComponent = () => {
  customElements.define("nightingale-heatmap", NightingaleHeatmap);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
