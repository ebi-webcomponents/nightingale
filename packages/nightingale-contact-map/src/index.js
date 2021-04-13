import NightingaleContactMap from "./nightingale-contact-map";

const loadComponent = () => {
  customElements.define("nightingale-contact-map", NightingaleContactMap);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
