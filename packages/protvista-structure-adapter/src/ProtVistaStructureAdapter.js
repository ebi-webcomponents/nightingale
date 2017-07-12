/*jslint node: true */
"use strict";

import {UniProtEntryDataAdapter} from 'uniprot-entry-data-adapter';
import {StructureDataParser} from './StructureDataParser';

export class ProtVistaStructureAdapter extends UniProtEntryDataAdapter {
    constructor() {
        super();
        this._parser = new StructureDataParser();
    }

    parseEntry(data) {
        this._adaptedData = this._parser.parseEntry(data);
    }
}