/*jslint node: true */
"use strict";

import ldFilter from 'lodash-es/filter';
import ldMap from 'lodash-es/map';
import ParserHelper from './ParserHelper';

const featureType = 'PDBE_COV';
const featureCategory = 'STRUCTURAL';

export default class StructureDataParser {
    constructor() {
        this._pdbFeatures = [];
    }

    parseEntry(data) {
        this._validateEntry(data);
        this._parseValidEntry(data);
        return this._pdbFeatures;
    }

    get pdbFeatures() {
        return this._pdbFeatures;
    }

    _validateEntry(data) {
        if (!data.sequence && ! data.sequence.sequence) {
            throw 'No sequence retrieved';
        }
        if (!data.dbReferences || (data.dbReferences.length === 0)) {
            throw 'No references retrieved'
        }
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        if (structures.length === 0) {
            throw 'No structural references reported for this accession';
        }
    }

    _parseValidEntry(data) {
        this._pdbFeatures = [];
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        this._pdbFeatures = ldMap(structures, (structure) => {
            const beginEnd = structure.properties.chains
                ? ParserHelper.getBeginEnd(structure.properties.chains) : {start: 0, end: 0};
            return {
                type: featureType,
                category: featureCategory,
                description: ParserHelper.getDescription(structure.properties),
                start: beginEnd.begin,
                end: beginEnd.end,
                xrefs: [{
                    name: 'PDB',
                    id: structure.id,
                    url: 'http://www.ebi.ac.uk/pdbe-srv/view/entry/' + structure.id
                }]
            };
        });
    }
}