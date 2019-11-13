import ProtvistaZoomable from "./protvista-zoomable";

const loadComponent = () => {
  customElements.define("protvista-zoomable", ProtvistaZoomable);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}

export default ProtvistaZoomable;
