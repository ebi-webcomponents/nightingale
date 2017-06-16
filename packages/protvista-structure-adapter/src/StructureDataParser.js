/*jslint node: true */
"use strict";

import ldFilter from 'lodash-es/filter';
import ldMap from 'lodash-es/map';
import {ParserHelper} from './ParserHelper';

const featureType = 'PDB_STRUCTURE';
const featureCategory = 'STRUCTURAL';

export class StructureDataParser {
    constructor(acc) {
        this._accession = acc;
        this._pdbFeatures = {};
    }

    parseEntry(data) {
        this._validateEntry(data);
        this._parseValidEntry(data);
        return this._pdbFeatures;
    }

    get accession() {
        return this._accession;
    }

    set accession(acc) {
        this._accession = acc;
    }

    get pdbFeatures() {
        return this._pdbFeatures;
    }

    _validateEntry(data) {
        if (this._accession !== data.accession) {
            throw 'Retrieved accession does not match with requested';
        }
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
        this._pdbFeatures.accession = data.accession;
        this._pdbFeatures.sequence = data.sequence.sequence;
        this._pdbFeatures.features = [];
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        this._pdbFeatures.features = ldMap(structures, (structure) => {
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
}