/*jslint node: true */
"use strict";

import ldFilter from 'lodash-es/filter';
import ldMap from 'lodash-es/map';
import {ParserHelper} from './ParserHelper';

const featureType = 'PDB_STRUCTURE';
const featureCategory = 'STRUCTURAL';

export class StructureDataParser extends HTMLElement{
    constructor() {
        super();
        this._parsedData = {test: 'test'};
        console.log(this._parsedData);
    }

    parseData(data) {
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
        //this.dispatchEvent('protvista-structure-adapter');
    }

    connectedCallback() {
        this.addEventListener('load', (e) => {
            //add some verification before parsing
            this.parseData(e.detail);
        });
    }

    get parsedData() {
        return this._parsedData;
    }
}