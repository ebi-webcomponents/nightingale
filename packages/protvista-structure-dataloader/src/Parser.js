/*jslint node: true */
"use strict";

class Parser {
    constructor(accession) {
        this._accession = accession;
        this.init();
    }

    init() {

    }

    get accession() {
        return this._accession;
    }

    set accession(accession) {
        this._accession = accession;
    };
}

module.exports = Parser;