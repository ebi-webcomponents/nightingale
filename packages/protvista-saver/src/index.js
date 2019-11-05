import ProtvistaSaver from "./protvista-saver";

const loadComponent = () => {
  customElements.define("protvista-saver", ProtvistaSaver);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
