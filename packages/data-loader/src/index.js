import DataLoader from "./data-loader";

if (window.customElements) {
  customElements.define(DataLoader.is, DataLoader);
}
