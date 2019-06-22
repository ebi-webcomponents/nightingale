import ProtvistaDatatable from "./protvista-datatable";

var loadComponent = function() {
  customElements.define(ProtvistaDatatable.tagName, ProtvistaDatatable);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}
