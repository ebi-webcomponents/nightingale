/*jslint node: true */
"use strict";

import _filter from 'lodash-es/filter';

export default class TopologyDataParser {
    parseEntry(data) {
        const topology = _filter(data.features, (feature) => {
            return feature.category === 'TOPOLOGY';
        });

        const topoDom = _filter(topology, feature => {
            return feature.type === 'TOPO_DOM';
        });

        topoDom.map(feature => {
            const description = feature.description;
            delete feature.description;
            return Object.assign(
                feature,
                {
                    'type': description.toUpperCase()
                }
            );
        });

        return topology;
    }
}