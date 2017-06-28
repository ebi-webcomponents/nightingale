/*jslint node: true */
"use strict";

import {StructureDataParser} from './StructureDataParser'

const loaderComponentType = 'uniprot-entry-data-loader';

export class StructureAdapterComponent extends HTMLElement {
    constructor() {
        super();
        this._listening = false;
        this._parser = new StructureDataParser();
        this._pdbFeatures = {};
    }

    connectedCallback() {
        const loader = this._initLoaders();
        this._addLoaderListeners();
    }

    get pdbFeatures() {
        return this._pdbFeatures;
    }

    _initLoaders() {
        let loaders = this.querySelectorAll(loaderComponentType);
        if (loaders.length === 0) {
            this.dispatchEvent(new CustomEvent(
                'error',
                {detail: 'No data to adapt as no loader was specified', bubbles: true}
            ));
        } else {
            this._removeChildrenInList(this, loaders, 1, loaders.length);
        }
        return loaders[0];
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
                try {
                    if (e.detail.payload.errorMessage) {
                        throw e.detail.payload.errorMessage;
                    }
                    this._pdbFeatures = this._parser.parseEntry(e.detail.payload);
                    this.dispatchEvent(new CustomEvent(
                        'ready',
                        {detail: this._pdbFeatures, bubbles: true}
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