import {
    categories
} from './categories';
import {html, render} from 'lit-html';
import '../styles/protvista-uniprot.css';

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
                this._render();
            })
        }

        async loadEntry(accession) {
            try {
                return await (await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${accession}`)).json();
            } catch (e) {
                console.log(`Couldn't load UniProt entry`, e);
            }
        }

        _render() {
            const mainHtml = () => html`
            <protvista-manager attributes="length displaystart displayend highlightstart highlightend variantfilters">
                <protvista-navigation length="${this._sequenceLength}"></protvista-navigation>
                <protvista-sequence length="${this._sequenceLength}"></protvista-sequence>
                ${categories.map(category =>
                    html`
                        <div class="category-label" data-category-toggle="${category.name}">${category.label}</div><div>${this.getTrack(this.getCategoryTypesAsString(category.tracks), 'non-overlapping')}</div>
                        ${category.tracks.map(track => html`<div class="track-label" data-toggle="${category.name}">${track.label}</div><div data-toggle="${category.name}">${this.getTrack(track.API)}</div>`)}
                    `
                )}
                <protvista-sequence id="seq1" length="${this._sequenceLength}"></protvista-sequence>
            </protvista-manager>`;
            render(mainHtml(), this);
            this.querySelectorAll('.category-label').forEach(cat => {
                cat.addEventListener('click', e => {
                    const toggle = e.target.getAttribute('data-category-toggle');
                    this.querySelectorAll(`[data-toggle=${toggle}]`).forEach(track => this.toggleVisibility(track));
                });
            });
        }

        toggleVisibility(elt) {
            console.log(elt.style.display);
            if(elt.style.display === 'none') {
                elt.style.display = 'block';
            } else {
                elt.style.display = 'none';
            }
        }

        getCategoryTypesAsString(tracks) {
            return tracks.map(t => t.API).join(",");
        }

        getTrack(trackTypes, layout = '') {
            return html`      
            <protvista-track length="${this._sequenceLength}" tooltip-event="click" layout="${layout}">
                <protvista-feature-adapter>
                    <data-loader>
                        <source src="https://www.ebi.ac.uk/proteins/api/features/${this._accession}?types=${trackTypes}" />
                    </data-loader>
                </protvista-feature-adapter>
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