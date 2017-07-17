/*jslint node: true */
"use strict";

import UniProtEntryDataAdapter from 'uniprot-entry-data-adapter';
import ParserHelper from './ParserHelper';

export default class ProtVistaFeatureAdapter extends UniProtEntryDataAdapter {
    constructor() {
        super();
        this._adapterType = 'protvista-feature-adapter';
        this._adaptedData = {};
    }

    parseEntry(data) {
        let features = data.features;

        if (features && (features.length !== 0)) {
            features = ParserHelper.groupEvidencesByCode(features);

            this._adaptedData[features[0].category] = features;
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