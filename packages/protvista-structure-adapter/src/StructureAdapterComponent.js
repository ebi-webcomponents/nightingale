/*jslint node: true */
"use strict";

import {EntryDataAdapter} from 'uniprot-entry-data-adapter';

export class StructureAdapterComponent extends EntryDataAdapter {
    constructor() {
        super();
    }

    parseEntry(data) {
        //TODO, do something here
        this._adaptedData = {};
    }
}