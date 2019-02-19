/*jslint node: true */
"use strict";

import ProtvistaUniprotEntryAdapter from "protvista-uniprot-entry-adapter";
import TopologyDataParser from "./TopologyDataParser";

export default class ProtVistaTopologyAdapter extends ProtvistaUniprotEntryAdapter {
  constructor() {
    super();
    this._parser = new TopologyDataParser();
  }

  parseEntry(data) {
    this._adaptedData = [];
    if (data && data.length !== 0) {
      this._adaptedData = this._parser.parseEntry(data);
      this._adaptedData.map(
        feature =>
          (feature.tooltipContent = this._basicHelper.formatTooltip(feature))
      );
      this._adaptedData = this._basicHelper.renameProperties(this._adaptedData);
    }
    return this._adaptedData;
  }
}
