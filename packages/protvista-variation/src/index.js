import ProtvistaVariation from "./protvista-variation";

const loadComponent = () => {
  customElements.define("protvista-variation", ProtvistaVariation);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
