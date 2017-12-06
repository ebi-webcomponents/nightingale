import {html, render} from 'lit-html';
import '../style/protvista-variation-filter.css';

const filters = [
    {
        name: 'disease',
        label: 'Likely disease',
        type: 'consequence',
        color: ['#990000']
    }, {
        name: 'predicted',
        type: 'consequence',
        label: 'Predicted (deleterious/benign)',
        color: ['#002594', '#8FE3FF']
    }, {
        name: 'nonDisease',
        type: 'consequence',
        label: 'Likely benign',
        color: ['#99cc00']
    }, {
        name: 'uncertain',
        type: 'consequence',
        label: 'Uncertain',
        color: '#FFCC00'
    }, {
        name: 'UniProt',
        type: 'provenance',
        label: 'UniProt reviewed'
    }, {
        name: 'ClinVar',
        type: 'provenance',
        label: 'ClinVar reviewed'
    }, {
        name: 'LSS',
        type: 'provenance',
        label: 'Large scale studies'
    }
];

const loadComponent = function () {
    class ProtvistaVariationFilter extends HTMLElement {

        constructor() {
            super();
            this._selectedFilters = [];
        }

        connectedCallback() {
            this.renderFilters();
        }

        renderFilters() {
            render(html `
                <h5>Filter Consequence</h5>
                <ul class="filter-list">
                    ${filters.filter(filter => filter.type === 'consequence').map(filter => html `
                        <li><a id="${filter.name}-filter" class="filter-select-trigger"><span class="filter-select-wrapper"><span class="filter-select" style="background-color: ${filter.color[0]}"></span></span>${filter.label}</a></li>
                    `)}
                </ul>
                <h5>Filter Data Provenance</h5>
                <ul class="filter-list">
                    ${filters.filter(filter => filter.type === 'provenance').map(filter => html `
                        <li id="${filter.name}-filter"><a id="${filter.name}-filter" class="filter-select-trigger"><span class="filter-select-wrapper"><span class="filter-select"></span></span>${filter.label}</a></li>
                    `)}
                </ul>
            `, this);

            filters.map(filter => this.querySelectorAll(`#${filter.name}-filter`)[0].addEventListener('click', e => this.toggleFilter(e.target, filter.name)));
        }

        toggleFilter(elt, filterName) {
            if (this._selectedFilters.filter(filt => filt.name === filterName).length > 0) {
                this._selectedFilters = this
                    ._selectedFilters
                    .filter(filt => filt.name !== filterName);
                elt
                    .classList
                    .remove('active');
            } else {
                this
                    ._selectedFilters
                    .push(filters.filter(filt => filt.name === filterName)[0]);
                elt
                    .classList
                    .add('active');
            }
            this.dispatchEvent(new CustomEvent("change", {
                detail: {
                    variantfilters: this
                        ._selectedFilters
                        .map(d => d.name)
                        .toString()
                },
                bubbles: true,
                cancelable: true
            }))
        }

    }
    customElements.define('protvista-variation-filter', ProtvistaVariationFilter);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document
        .addEventListener('WebComponentsReady', function () {
            loadComponent();
        });
}
