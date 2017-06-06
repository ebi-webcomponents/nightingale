/*jslint node: true */
"use strict";

import {StructureDataParser} from './StructureDataParser'

export class StructureAdapterComponent extends HTMLElement {
    constructor() {
        super();
        this._parser = new StructureDataParser('');
        this._parsedData = {};
        console.log('component built');
    }

    static get observedAttributes() { return ['accession']; }

    connectedCallback() {
        console.log('connectedCallback', this._accession);
        this.addEventListener('load', (e) => {
            this._parser.accession = this.accession;
            try {
                this._parser.parseData(e.detail);
                console.log(this._parser.parsedData);
                // this.dispatchEvent('protvista-structure-adapter');
            } catch(error) {
                // this.dispatchEvent('protvista-structure-adapter');
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback');
        // name will always be "accession" due to observedAttributes
        this._accession = newValue;
    }

    get accession() {
        return this._accession;
    }

    set accession(acc) {
        this.setAttribute('accession', acc);
    }
}