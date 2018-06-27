/*jslint node: true */
"use strict";

export default class ProteomicsDataParser {
    parseEntry(data) {
        data.features.map((feature) => {
            return Object.assign(
                feature,
                {
                    'category': 'PROTEOMICS',
                    'type': feature.unique ? 'unique' : 'non_unique'
                }
            );
        });
        return data.features;
    }
}