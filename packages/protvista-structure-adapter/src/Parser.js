/*jslint node: true */
"use strict";

const _ = require('underscore');
const Constants = require('./Constants');
const ParserHelper = require('./ParserHelper');
require('./UniProtEntryLoader');

const transformData = (self, json) => {
    self._parsedData.accession = self.accession;
    self._parsedData.sequence = json.sequence.sequence;
    self._parsedData.features = [];
    const structures = _.filter(json.dbReferences, (reference) => {
        return reference.type === 'PDB';
    });
    self._parsedData.features = _.map(structures, (structure) => {
        const beginEnd = structure.properties.chains
            ? ParserHelper.getBeginEnd(structure.properties.chains) : {begin: 0, end: 0};
        return {
            type: self.featureType,
            category: self.featureCategory,
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
};

class Parser {
    constructor(accession, provider) {
        this._accession = accession;
        this._provider = provider;
        this._featureType = "PDB_STRUCTURE";
        this._featureCategory = "STRUCTURAL";
        this._parsedData = {};
        if (!Constants.isValidProvider(this._provider)) {
            this._provider = Constants.getDefaultProvider();
        }

        const handler = require('./' + Constants.getWebServiceHandler(this._provider));
        this._loader = new handler(accession);
    }

    parse() {
        let self = this;
        this._loader.retrieveEntryPromise()
            .then(function(json) {
                transformData(self, json);
                console.log(self.parsedData);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    get accession() {
        return this._accession;
    }

    get provider() {
        return this._provider;
    }

    get loader() {
        return this._loader;
    }

    get featureType() {
        return this._featureType;
    }

    get featureCategory() {
        return this._featureCategory;
    }

    get parsedData() {
        return this._parsedData;
    }
}

module.exports = Parser;