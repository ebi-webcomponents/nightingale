/*jslint node: true */
"use strict";

const loaderComponentType = 'uniprot-entry-data-loader';

export default class UniProtEntryDataAdapter extends HTMLElement {
    constructor() {
        super();
        this._adapterType = 'uniprot-entry-data-adapter';
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
        return this._adaptedData;
    }

    get adaptedData() {
        return this._adaptedData;
    }

    _initLoaders() {
        let children = this.children;
        if (this.childElementCount !== 1) {
            this.dispatchEvent(new CustomEvent(
                'warning',
                {detail: 'Only one loader OR adapter is allowed, the first one will be used, the others dismissed',
                    bubbles: true, cancelable: true}
            ));
            this._removeChildrenInList(this, children, 1, this.childElementCount);
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
                        'adapt',
                        {
                            detail: {adapter: this._adapterType, data: this._adaptedData},
                            bubbles: true, cancelable: true
                        }
                    ));
                } catch(error) {
                    this.dispatchEvent(new CustomEvent(
                        'error',
                        {
                            detail: error,
                            bubbles: true, cancelable: true}
                    ));
                }
            });
            this.addEventListener('adapt', (e) => {
                if (e.detail.adapter !== this._adapterType) {
                    //only listen to other adapters not to itself (so infinite loop is avoided)
                    e.stopPropagation();
                    this.parseEntry(e.detail.data);
                    this.dispatchEvent(new CustomEvent(
                        'adapt',
                        {
                            detail: {adapter: this._adapterType, data: this._adaptedData},
                            bubbles: true, cancelable: true
                        }
                    ));
                }
            });
        }
    }
}