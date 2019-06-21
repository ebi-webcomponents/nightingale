import ProtvistaVariationGraph from "./protvista-variation-graph";

const loadComponent = function() {
  customElements.define("protvista-variation-graph", ProtvistaVariationGraph);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}
