import ProtVistaManager from "./protvista-manager";

const loadComponent = () => {
  customElements.define("protvista-manager", ProtVistaManager);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
