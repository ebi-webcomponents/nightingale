import VCFAdapter from "./vcf-adapter";

if (window.customElements) {
  customElements.define(VCFAdapter.is, VCFAdapter);
}
