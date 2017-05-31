/*jslint node: true */
"use strict";

const fetch = require('node-fetch');

const Constants = require('./Constants');
const Loader = require('./Loader');

class UniProtEntryLoader extends Loader {
    constructor(accession) {
        super(accession);
    }

    retrieveEntryPromise() {
        return fetch(Constants.getWebServiceURL('uniprot') + this.accession, {
            headers: {'Accept': 'application/json'}
        }).then(res => {
            return res.json();
        } );
    }
}

module.exports = UniProtEntryLoader;