/*jslint node: true */
"use strict";

let fetch = require('node-fetch');

let Constants = require('./Constants');
let Loader = require('./Loader');

class UniProtEntryLoader extends Loader {
    constructor(accession) {
        super(accession);
    }

    retrieveEntryPromise() {
        return fetch(Constants.getWebServiceURL('uniprot') + this.accession, {
            headers: {'Accept': 'application/json'}
        });
    }
}

module.exports = UniProtEntryLoader;