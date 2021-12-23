import ProtvistaFeatureAdapter from "./protvista-feature-adapter";

if (window.customElements) {
  customElements.define(ProtvistaFeatureAdapter.is, ProtvistaFeatureAdapter);
}

export default ProtvistaFeatureAdapter;
