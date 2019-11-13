import ProtVistaColouredSequence from "./protvista-coloured-sequence";

const loadComponent = () => {
  customElements.define(
    "protvista-coloured-sequence",
    ProtVistaColouredSequence
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
