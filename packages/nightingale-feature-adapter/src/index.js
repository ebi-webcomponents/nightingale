import { defineElement } from "@nightingale-elements/nightingale-core";
import NightingaleFeatureAdapter from "./nightingale-feature-adapter";

defineElement(NightingaleFeatureAdapter);

export default NightingaleFeatureAdapter;
export {
  formatTooltip,
  renameProperties,
  formatXrefs,
  getEvidenceFromCodes,
} from "./BasicHelper";
