import ProtvistaFilter, { ProtvistaCheckbox } from "./protvista-filter";

const loadComponent = () => {
  customElements.define("protvista-checkbox", ProtvistaCheckbox);
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
