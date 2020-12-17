import { defineElement } from "@nightingale-elements/utils";
import NightingaleFeatureAdapter from "./nightingale-feature-adapter";

defineElement(NightingaleFeatureAdapter);

export default NightingaleFeatureAdapter;
export {
  formatTooltip,
  renameProperties,
  formatXrefs,
  getEvidenceFromCodes,
} from "./BasicHelper";
