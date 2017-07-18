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
        console.log('parsing');
        this._adaptedData = data.features;

        if (this._adaptedData && (this._adaptedData.length !== 0)) {
            this._adaptedData = ParserHelper.groupEvidencesByCode(this._adaptedData);
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