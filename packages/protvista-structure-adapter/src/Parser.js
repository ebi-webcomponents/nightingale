/*jslint node: true */
"use strict";

let Constants = require('./Constants');
let _ = require('underscore')

class Parser {
    constructor(accession, provider) {
        this._accession = accession;
        this._provider = provider;
        if (!Constants.isValidProvider(this._provider)) {
            this._provider = Constants.getDefaultProvider();
        }

        this._handler = require('./' + Constants.getWebServiceHandler(this._provider));
    }

    parse() {

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
    };
}

module.exports = Parser;