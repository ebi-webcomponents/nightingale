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
        label: 'Predicted (deleterious/benign)',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study'));
            return filteredData;
        }
    }, {
        name: 'nonDisease',
        type: 'consequence',
        label: 'Likely benign',
        applyFilter: data => {}
    }, {
        name: 'uncertain',
        type: 'consequence',
        label: 'Uncertain',
        applyFilter: data => {}
    }, {
        name: 'UniProt',
        type: 'provenance',
        label: 'UniProt reviewed',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'uniprot' || variant.sourceType === 'mixed'));
            return filteredData;
        }
    }, {
        name: 'ClinVar',
        type: 'provenance',
        label: 'ClinVar reviewed',
        applyFilter: data => {}
    }, {
        name: 'LSS',
        type: 'provenance',
        label: 'Large scale studies',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study' || variant.sourceType === 'mixed'));
            return filteredData;
        }
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