import ProtvistaVariation from "./protvista-variation";

var loadComponent = function() {
  customElements.define("protvista-variation", ProtvistaVariation);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}
