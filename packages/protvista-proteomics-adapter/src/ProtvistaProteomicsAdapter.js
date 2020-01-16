import ProtvistaFeatureAdapter, {
  renameProperties,
  formatTooltip
} from "protvista-feature-adapter";
import { v1 } from "uuid";

export const transformData = data => {
  let adaptedData = [];
  if (data && data.length !== 0) {
    adaptedData = data.features.map(feature => {
      return Object.assign(feature, {
        category: "PROTEOMICS",
        type: feature.unique ? "unique" : "non_unique",
        tooltipContent: formatTooltip(feature),
        protvistaFeatureId: v1()
      });
    });
    adaptedData = renameProperties(adaptedData);
  }
  return adaptedData;
};

class ProtvistaProteomicsAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = transformData(data);
    return this._adaptedData;
  }
}

export default ProtvistaProteomicsAdapter;
