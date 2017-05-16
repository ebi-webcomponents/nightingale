/*jslint node: true */
"use strict";

let $ = require('jquery');

let Constants = require('./Constants');
let Loader = require('./Loader');

class UniProtEntryLoader extends Loader {
    constructor(accession) {
        super(accession);
    }

    retrieveEntry() {
        return $.getJSON(Constants.getWebServiceURL('uniprot') + this.accession);
    }
}

module.exports = UniProtEntryLoader;