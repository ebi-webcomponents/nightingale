/*jslint node: true */
"use strict";

import {_} from 'underscore';
import {ParserHelper} from './ParserHelper';

const featureType = 'PDB_STRUCTURE';
const featureCategory = 'STRUCTURAL';

export class StructureDataParser {
    constructor() {
        this._parsedData = {};
    }

    parseData(data) {
        this._parsedData.accession = data.accession;
        this._parsedData.sequence = data.sequence.sequence;
        this._parsedData.features = [];
        const structures = _.filter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        this._parsedData.features = _.map(structures, (structure) => {
            const beginEnd = structure.properties.chains
                ? ParserHelper.getBeginEnd(structure.properties.chains) : {begin: 0, end: 0};
            return {
                type: featureType,
                category: featureCategory,
                description: ParserHelper.getDescription(structure.properties),
                begin: beginEnd.begin,
                end: beginEnd.end,
                xrefs: [{
                    name: 'PDB',
                    id: structure.id,
                    url: 'http://www.ebi.ac.uk/pdbe-srv/view/entry/' + structure.id
                }]
            };
        });
    }

    get parsedData() {
        return this._parsedData;
    }
}