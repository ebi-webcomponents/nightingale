/*jslint node: true */
"use strict";

import UniProtEntryDataAdapter from 'uniprot-entry-data-adapter';
import ParserHelper from './ParserHelper';

import _isEmpty from 'lodash-es/isEmpty';

export default class ProtVistaFeatureAdapter extends UniProtEntryDataAdapter {
    constructor() {
        super();
        this._adaptedData = {};
    }

    parseEntry(data) {
        let features = data.features;

        if (features && (features.length !== 0)) {
            features = ParserHelper.groupEvidencesByCode(features);

            if (_isEmpty(this._adaptedData)) {
                this._adaptedData[features[0].category] = features;
            } else {
                this._adaptedData[features[0].category] = this._adaptedData[features[0].category].concat(features);
            }
            /*
             TODO old way to return categories remove when category viewer has been modified to {}
             var orderedPairs = [];
             orderedPairs.push([
             features[0].category,
             features
             ]);
             return orderedPairs;
             */
        }
        return this._adaptedData;
    }
}