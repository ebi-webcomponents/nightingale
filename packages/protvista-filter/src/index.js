import ProtvistaFilter from "./protvista-filter";

const loadComponent = () => {
  customElements.define("protvista-filter", ProtvistaFilter);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
