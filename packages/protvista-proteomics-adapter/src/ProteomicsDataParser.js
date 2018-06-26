/*jslint node: true */
"use strict";

export default class ProteomicsDataParser {
    constructor() {
        this._proteomicsFeatures = [];
    }

    parseEntry(data) {
        this._proteomicsFeatures = data.map((feature) => {
            return Object.assign(
                feature,
                {
                    'category': 'PROTEOMICS',
                    'type': feature.unique ? 'unique' : 'non_unique'
                }
            );
        });
        return this._proteomicsFeatures;
    }

    get proteomicsFeatures() {
        return this._proteomicsFeatures;
    }
}