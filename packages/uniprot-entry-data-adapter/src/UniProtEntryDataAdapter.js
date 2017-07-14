/*jslint node: true */
"use strict";

const loaderComponentType = 'uniprot-entry-data-loader';

export default class UniProtEntryDataAdapter extends HTMLElement {
    constructor() {
        super();
        this._listening = false;
        this._adaptedData = {};
    }

    connectedCallback() {
        this._initLoaders();
        this._addLoaderListeners();
    }

    parseEntry(data) {
        //Specialized versions of this generic adapter should implement this method so data is actually transformed
        // and adapted.
        this._adaptedData = data;
    }

    get adaptedData() {
        return this._adaptedData;
    }

    _initLoaders() {
        let loaders = this.querySelectorAll(loaderComponentType);
        if (loaders.length === 0) {
            //TODO If no loaders, then at least one adapter
            this.dispatchEvent(new CustomEvent(
                'error',
                {detail: 'No data to adapt as no loader was specified', bubbles: true}
            ));
        } else {
            this.dispatchEvent(new CustomEvent(
                'warning',
                {detail: 'Only one loader is allowed, the first one will be used, the others dismissed', bubbles: true}
            ));
            this._removeChildrenInList(this, loaders, 1, loaders.length);
        }
    }

    _removeChildrenInList(elem, list, start, end) {
        for (let i = start; (i < end) && (i < list.length); i++) {
            elem.removeChild(list[i]);
        }
    }

    _addLoaderListeners() {
        if (!this._listening) {
            this._listening = true;
            this.addEventListener('load', (e) => {
                e.stopPropagation();
                try {
                    if (e.detail.payload.errorMessage) {
                        throw e.detail.payload.errorMessage;
                    }
                    this.parseEntry(e.detail.payload);
                    this.dispatchEvent(new CustomEvent(
                        'load',
                        {detail: {payload: this._adaptedData}, bubbles: true}
                    ));
                } catch(error) {
                    this.dispatchEvent(new CustomEvent(
                        'error',
                        {detail: error, bubbles: true}
                    ));
                }
            });
        }
    }
}