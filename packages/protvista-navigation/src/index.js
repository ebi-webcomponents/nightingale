import ProtVistaNavigation from "./protvista-navigation";

const loadComponent = () => {
  customElements.define("protvista-navigation", ProtVistaNavigation);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
