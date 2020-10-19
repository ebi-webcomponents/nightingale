import ProtvistaFeatureAdapter from "./protvista-feature-adapter";

if (window.customElements) {
  customElements.define("protvista-feature-adapter", ProtvistaFeatureAdapter);
}

export default ProtvistaFeatureAdapter;
export {
  formatTooltip,
  renameProperties,
  formatXrefs,
  getEvidenceFromCodes,
} from "./BasicHelper";
