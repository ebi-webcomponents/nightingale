import ProtvistaVariationAdapter from "./ProtvistaVariationAdapter";

const loadComponent = () => {
  customElements.define(
    "protvista-variation-adapter",
    ProtvistaVariationAdapter
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
