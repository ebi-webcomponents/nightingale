/*jslint node: true */
"use strict";

import {EntryDataAdapter} from 'uniprot-entry-data-adapter';
import {StructureDataParser} from './StructureDataParser';

export class StructureAdapterComponent extends EntryDataAdapter {
    constructor() {
        super();
        this._parser = new StructureDataParser();
    }

    parseEntry(data) {
        this._adaptedData = this._parser.parseEntry(data);
    }
}