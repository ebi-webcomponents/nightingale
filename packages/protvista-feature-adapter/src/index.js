import ProtvistaFeatureAdapter from "./ProtvistaFeatureAdapter";

if (window.customElements) {
  customElements.define(
    "protvista-uniprot-entry-adapter",
    ProtvistaFeatureAdapter
  );
}

export default ProtvistaFeatureAdapter;
