import ProtvistaZoomable from "./protvista-zoomable";

const loadComponent = function() {
  customElements.define("protvista-zoomable", ProtvistaZoomable);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    loadComponent();
  });
}

export default ProtvistaZoomable;
