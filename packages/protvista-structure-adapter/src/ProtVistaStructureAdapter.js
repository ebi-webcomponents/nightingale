/*jslint node: true */
"use strict";

import StructureDataParser from "./StructureDataParser";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";

export default class ProtVistaStructureAdapter extends ProtvistaFeatureAdapter {
  constructor() {
    super();
    this._parser = new StructureDataParser();
  }

  parseEntry(data) {
    this._adaptedData = [];
    if (data && data.length !== 0) {
      this._adaptedData = this._parser.parseEntry(data);
      this._adaptedData.map(
        feature =>
          (feature.tooltipContent = this._parser.formatTooltip(feature))
      );
    }
    return this._adaptedData;
  }
}
