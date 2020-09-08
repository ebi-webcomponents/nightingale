import ProtvistaVariationAdapter from "./protvistaVariationAdapter";

if (window.customElements) {
  customElements.define(
    ProtvistaVariationAdapter.is,
    ProtvistaVariationAdapter
  );
}
