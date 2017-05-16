/*jslint node: true */
"use strict";

let Constants = require('./Constants');
let _ = require('underscore');
require('./UniProtEntryLoader');

class Parser {
    constructor(accession, provider) {
        this._accession = accession;
        this._provider = provider;
        if (!Constants.isValidProvider(this._provider)) {
            this._provider = Constants.getDefaultProvider();
        }

        let handler = require('./' + Constants.getWebServiceHandler(this._provider));
        this._loader = new handler(accession);
    }

    parse() {
        this._loader.retrieveEntry().done(function(response) {
            console.log(response);
        });
    }

    get accession() {
        return this._accession;
    }

    set accession(accession) {
        this._accession = accession;
    };

    get provider() {
        return this._provider;
    }

    set provider(provider) {
        this._provider = provider;
    }

    get loader() {
        return this._loader;
    }
}

module.exports = Parser;