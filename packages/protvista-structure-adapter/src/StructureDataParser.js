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
        this._parsedData = {};
    }

    parseData(data) {
        this._validateData(data);
        this._parseValidData(data);
    }

    get accession() {
        return this._accession;
    }

    set accession(acc) {
        this._accession = acc;
    }

    get parsedData() {
        return this._parsedData;
    }

    _validateData(data) {
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

    _parseValidData(data) {
        this._parsedData.accession = data.accession;
        this._parsedData.sequence = data.sequence.sequence;
        this._parsedData.features = [];
        const structures = ldFilter(data.dbReferences, (reference) => {
            return reference.type === 'PDB';
        });
        this._parsedData.features = ldMap(structures, (structure) => {
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