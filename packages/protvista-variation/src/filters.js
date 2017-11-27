import cloneDeep from 'lodash-es/cloneDeep';
import {html, render} from 'lit-html';

const filters = [
    {
        name: 'disease',
        label: 'Likely disease',
        type: 'consequence',
        color: ['#990000'],
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.association && variant.association.some(d => d.disease)));
            return filteredData;
        }
    }, {
        name: 'predicted',
        type: 'consequence',
        label: 'Predicted (deleterious/benign)',
        color: [
            '#002594', '#8FE3FF'
        ],
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study'));
            return filteredData;
        }
    }, {
        name: 'nonDisease',
        type: 'consequence',
        label: 'Likely benign',
        color: ['#99cc00'],
        applyFilter: data => {}
    }, {
        name: 'uncertain',
        type: 'consequence',
        label: 'Uncertain',
        color: '#FFCC00',
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

    toggleFilter(elt, filterName) {
        if (this._selectedFilters.filter(filt => filt.name === filterName).length > 0) {
            this._selectedFilters = this
                ._selectedFilters
                .filter(filt => filt.name !== filterName);
            elt
                .parentElement
                .classList
                .remove('active');
        } else {
            this
                ._selectedFilters
                .push(filters.filter(filt => filt.name === filterName)[0]);
            elt
                .parentElement
                .classList
                .add('active');
        }
        this.dispatchEvent(new CustomEvent('protvista-filter-variants', {detail: this._selectedFilters}));
    }

    get selectedFilters() {
        return this._selectedFilters;
    }

    renderFilters() {
        render(html `
            <h5>Filter Consequence</h5>
            <ul class="filter-list">
                ${filters.filter(filter => filter.type === 'consequence').map(filter => html `
                    <li><a href="#" id="${filter.name}-filter" class="filter-select-trigger"><span class="filter-select" style="background-color: ${filter.color[0]}"></span></a>${filter.label}</li>
                `)}
            </ul>
            <h5>Filter Data Provenance</h5>
            <ul class="filter-list">
                ${filters.filter(filter => filter.type === 'provenance').map(filter => html `
                    <li id="${filter.name}-filter"><a href="#" id="${filter.name}-filter" class="filter-select-trigger"><span class="filter-select"></span></a>${filter.label}</li>
                `)}
            </ul>
        `, this);

        filters.map(filter => this.querySelectorAll(`#${filter.name}-filter`)[0].addEventListener('click', e => this.toggleFilter(e.target, filter.name)));
    }
}

export default ProtVistaVariationFilters;