import ProtvistaTooltip from "./protvista-tooltip";

const loadComponent = () => {
  customElements.define("protvista-tooltip", ProtvistaTooltip);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
