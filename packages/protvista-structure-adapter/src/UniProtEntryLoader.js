/*jslint node: true */
"use strict";

let fetch = require('node-fetch');

let Constants = require('./Constants');
let Loader = require('./Loader');

class UniProtEntryLoader extends Loader {
    constructor(accession) {
        super(accession);
    }

    retrieveEntry() {
        return fetch(Constants.getWebServiceURL('uniprot') + this.accession, {
            headers: {'Accept': 'application/json'}
        }).then(function(response) {
            return response.json();
        });
    }
}

module.exports = UniProtEntryLoader;