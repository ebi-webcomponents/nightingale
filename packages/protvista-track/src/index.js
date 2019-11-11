import ProtvistaTrack from "./protvista-track";

const loadComponent = () => {
  customElements.define("protvista-track", ProtvistaTrack);
};
// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener("WebComponentsReady", () => {
    loadComponent();
  });
}

export { default as DefaultLayout } from "./DefaultLayout";
export default ProtvistaTrack;
