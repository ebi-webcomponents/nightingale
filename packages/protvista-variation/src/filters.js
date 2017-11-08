import cloneDeep from 'lodash-es/cloneDeep';
import {html, render} from 'lit-html';

const filters = {
    consequenceFilters: [
        {
            name: 'disease',
            label: 'Likely disease',
            filter: data => {
                const filteredData = cloneDeep(data);
                filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.association && variant.association.some(d => d.disease)));
                return filteredData;
            }
        }, {
            name: 'predicted',
            label: 'Predicted (deleterious/benign)'
        }, {
            name: 'nonDisease',
            label: 'Likely benign'
        }, {
            name: 'uncertain',
            label: 'Uncertain'
        }
    ],
    provenanceFilters: [
        {
            name: 'UniProt',
            label: 'UniProt reviewed'
        }, {
            name: 'ClinVar',
            label: 'ClinVar reviewed'
        }, {
            name: 'LSS',
            label: 'Large scale studies'
        }
    ]
}

class ProtVistaVariationFilters extends HTMLElement {

    connectedCallback() {
        this.renderFilters();
    }

    toggleFilter(filterName) {
        console.log(filterName);
    }

    renderFilters() {
        render(html `
        <h4>Filter</h4>
            <h5>Consequence</h5>
            <ul>
                ${filters.consequenceFilters.map(filter => html `
                    <li><label><a id="${filter.name}-filter">${filter.label}</a></label></li>
                `)}
            </ul>
            <h5>Data Provenance</h5>
            <ul>
                ${filters.provenanceFilters.map(filter => html `
                    <li><a id="${filter.name}-filter">${filter.label}</a></li>
                `)}
            </ul>
        `, this);

        filters
            .consequenceFilters
            .map(filter => this.querySelectorAll(`#${filter.name}-filter`)[0].addEventListener('click', e => this.toggleFilter(filter.name)));
        filters
            .provenanceFilters
            .map(filter => this.querySelectorAll(`#${filter.name}-filter`)[0].addEventListener('click', e => this.toggleFilter(filter.name)));
    }
}

export default ProtVistaVariationFilters;