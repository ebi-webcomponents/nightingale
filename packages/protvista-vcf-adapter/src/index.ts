import VCFAdapter from "./protvista-vcf-adapter";

if (window.customElements) {
  customElements.define(VCFAdapter.is, VCFAdapter);
}
