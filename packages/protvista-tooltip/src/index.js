import ProtvistaTooltip from "./protvista-tooltip";

const loadComponent = function() {
  customElements.define("protvista-tooltip", ProtvistaTooltip);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}
