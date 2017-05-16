/*jslint node: true */
"use strict";

class Loader {
    constructor(accession) {
        this._accession = accession;
    }

    retrieveEntry() {
        return {};
    }

    get accession() {
        return this._accession;
    }

    set accession(accession) {
        this._accession = accession;
    };
}

module.exports = Loader;