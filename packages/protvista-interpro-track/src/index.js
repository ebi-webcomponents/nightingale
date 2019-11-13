import ProtvistaInterproTrack from "./protvista-interpro-track";

const loadComponent = () => {
  customElements.define("protvista-interpro-track", ProtvistaInterproTrack);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}
