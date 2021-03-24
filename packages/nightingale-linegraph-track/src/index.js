import NightingaleLineGraphTrack from "./nightingale-linegraph-track";

const loadComponent = () => {
  customElements.define(
    "nightingale-linegraph-track",
    NightingaleLineGraphTrack
  );
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
