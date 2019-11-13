import InteractionViewer from "./interaction-viewer";

const loadComponent = () => {
  customElements.define("interaction-viewer", InteractionViewer);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    console.log("Loaded with polyfill.");
    loadComponent();
  });
}
