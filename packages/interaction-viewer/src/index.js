import InteractionViewer from "./interaction-viewer";

var loadComponent = function() {
  customElements.define("interaction-viewer", InteractionViewer);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", function() {
    console.log("Loaded with polyfill.");
    loadComponent();
  });
}
