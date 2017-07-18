/*jslint node: true */
"use strict";

import UniProtEntryDataAdapter from './UniProtEntryDataAdapter';

export default class EmptyDataAdapter extends UniProtEntryDataAdapter {
    constructor() {
        super();
        this._adapterType = 'empty-dummy-data-adapter';
        this._adaptedData = {};
    }

    parseEntry(data) {
        this._adapterType = {};
        return this._adaptedData;
    }
}