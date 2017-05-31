/*jslint node: true */
"use strict";

const Constants = require('./Constants');
const _ = require('underscore');
const ParserHelper = require('./ParserHelper');
require('./UniProtEntryLoader');

class Parser {
    constructor(accession, provider) {
        this._accession = accession;
        this._provider = provider;
        this._featureType = "PDB_STRUCTURE";
        this._featureCategory = "STRUCTURAL";
        this._parsedObject = {};
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
                console.log(json);
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
}

module.exports = Parser;