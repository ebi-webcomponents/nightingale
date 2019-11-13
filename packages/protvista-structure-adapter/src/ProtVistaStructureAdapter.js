import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import StructureDataParser from "./StructureDataParser";

export default class ProtVistaStructureAdapter extends ProtvistaFeatureAdapter {
  constructor() {
    super();
    this._parser = new StructureDataParser();
  }

  parseEntry(data) {
    this._adaptedData = [];
    if (data && data.length !== 0) {
      this._adaptedData = this._parser.parseEntry(data);
      this._adaptedData.forEach(feature => {
        /* eslint-disable no-param-reassign */
        feature.tooltipContent = StructureDataParser.formatTooltip(feature);
      });
    }
    return this._adaptedData;
  }
}
