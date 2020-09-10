import ProtvistaVariationAdapter from "./protvista-variation-adapter";

if (window.customElements) {
  customElements.define(
    ProtvistaVariationAdapter.is,
    ProtvistaVariationAdapter
  );
}
