import cloneDeep from 'lodash-es/cloneDeep';
import {html, render} from 'lit-html';

const filters = [
    {
        name: 'disease',
        label: 'Likely disease',
        type: 'consequence',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.association && variant.association.some(d => d.disease)));
            return filteredData;
        }
    }, {
        name: 'predicted',
        type: 'consequence',
        label: 'Predicted (deleterious/benign)'
    }, {
        name: 'nonDisease',
        type: 'consequence',
        label: 'Likely benign'
    }, {
        name: 'uncertain',
        type: 'consequence',
        label: 'Uncertain'
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
class ProtVistaVariationFilters extends HTMLElement {

    constructor() {
        super();
        this._selectedFilters = [];
    }

    connectedCallback() {
        this.renderFilters();
    }

    toggleFilter(filterName) {
        if (this._selectedFilters.filter(filt => filt.name === filterName).length > 0) {
            this._selectedFilters = this
                ._selectedFilters
                .filter(filt => filt.name !== filterName);
        } else {
            this
                ._selectedFilters
                .push(filters.filter(filt => filt.name === filterName)[0]);
        }
        this.dispatchEvent(new CustomEvent('protvista-filter-variants', {detail: this._selectedFilters}));
    }

    get selectedFilters() {
        return this._selectedFilters;
    }

    renderFilters() {
        render(html `
        <h4>Filter</h4>
            <h5>Consequence</h5>
            <ul>
                ${filters.filter(filter => filter.type === 'consequence').map(filter => html `
                    <li><a id="${filter.name}-filter">${filter.label}</a></li>
                `)}
            </ul>
            <h5>Data Provenance</h5>
            <ul>
                ${filters.filter(filter => filter.type === 'provenance').map(filter => html `
                    <li><a id="${filter.name}-filter">${filter.label}</a></li>
                `)}
            </ul>
        `, this);

        filters.map(filter => this.querySelectorAll(`#${filter.name}-filter`)[0].addEventListener('click', e => this.toggleFilter(filter.name)));
    }
}

export default ProtVistaVariationFilters;