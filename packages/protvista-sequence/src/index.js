import ProtVistaSequence from "./protvista-sequence";

const loadComponent = () => {
  customElements.define("protvista-sequence", ProtVistaSequence);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
