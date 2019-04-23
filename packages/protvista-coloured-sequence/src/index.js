import ProtVistaColouredSequence from "./protvista-coloured-sequence";

const loadComponent = function() {
  customElements.define(
    "protvista-coloured-sequence",
    ProtVistaColouredSequence
  );
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}

export default ProtVistaColouredSequence;
