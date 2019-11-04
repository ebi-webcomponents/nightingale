import ProtvistaDatatable from "./protvista-datatable";

const loadComponent = () => {
  customElements.define(ProtvistaDatatable.tagName, ProtvistaDatatable);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
