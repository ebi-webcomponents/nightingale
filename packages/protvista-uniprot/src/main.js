import {
    categories
} from './categories';

const loadComponent = function () {
    class ProtvistaUniprot extends HTMLElement {

        constructor() {
            super();
            this._accession = this.getAttribute('accession');
            // get properties here
        }

        connectedCallback() {
            this.loadEntry(this._accession).then(entryData => {
                this._sequenceLength = entryData.sequence.sequence.length;
                // We need to get the length of the protein before rendering it
                this.render();
            })
        }

        async loadEntry(accession) {
            try {
                return await (await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${accession}`)).json();
            } catch (e) {
                console.log(`Couldn't load UniProt entry`, e);
            }
        }

        render() {
            let html = `
            <protvista-manager attributes="length displaystart displayend highlightstart highlightend variantfilters">
                <protvista-navigation length="${this._sequenceLength}"></protvista-navigation>
                <protvista-sequence length="${this._sequenceLength}"></protvista-sequence>
                ${categories.map(category => 
                    `
                        <div class="">${category.label}</div>
                        ${category.tracks.map(track => `<div class="">${track.label}</div><div>${this.getTrack()}</div>`).join('')}
                    `
                ).join('')}
                <protvista-sequence id="seq1" length="${this._sequenceLength}"></protvista-sequence>
            </protvista-manager>
            `;
            this.innerHTML = html;
        }

        getTrack() {
            return `      
            <protvista-track id="track1" length="${this._sequenceLength}">
                <protvista-feature-adapter>
                <uniprot-entry-data-loader accession="${this._accession}">
                    <source src="https://www.ebi.ac.uk/proteins/api/features/{0}?categories=PTM" />
                </uniprot-entry-data-loader>
                </protvista-feature-adapter>
                <data-loader data-key="config">
                    <source src="https://cdn.jsdelivr.net/npm/protvista-track/dist/config.json">
                </data-loader>
            </protvista-track>
            `;
        }

    }
    customElements.define('protvista-uniprot', ProtvistaUniprot);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}