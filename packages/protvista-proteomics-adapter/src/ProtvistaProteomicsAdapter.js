import ProtvistaFeatureAdapter from "protvista-feature-adapter";

class ProtvistaProteomicsAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = [];
    if (data && data.length !== 0) {
      this._adaptedData = data.features.map(feature => {
        return Object.assign(feature, {
          category: "PROTEOMICS",
          type: feature.unique ? "unique" : "non_unique",
          tooltipContent: this._basicHelper.formatTooltip(feature)
        });
      });
      this._adaptedData = this._basicHelper.renameProperties(this._adaptedData);
    }
    return this._adaptedData;
  }
}

export default ProtvistaProteomicsAdapter;
