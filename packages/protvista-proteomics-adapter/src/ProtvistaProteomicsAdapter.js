import ProtvistaFeatureAdapter, {
  transformData as featureTransformData,
} from "protvista-feature-adapter";

export const transformData = (data) => {
  // Not using super as this is used in other places
  let adaptedData = featureTransformData(data);
  adaptedData = adaptedData.map((feature) => ({
    ...feature,
    category: "PROTEOMICS",
    type: feature.data.unique ? "unique" : "non_unique",
  }));
  return adaptedData;
};

class ProtvistaProteomicsAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = transformData(data);
    return this._adaptedData;
  }
}

export default ProtvistaProteomicsAdapter;
