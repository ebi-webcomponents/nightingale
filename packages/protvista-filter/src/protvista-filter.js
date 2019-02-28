import { html, render } from "lit-html";

import './style.css';
import './checkbox.js';

const filters = [
    {
        name: 'disease',
        type: 'consequence',
        selected: true,
        options: {
          labels: ['Likely disease'],
          colors: ['#990000']
        }
    }, {
        name: 'predicted',
        type: 'consequence',
        selected: false,
        options: {
          labels: ['Predicted (deleterious/benign)', 'Bar'],
          colors: ['#002594', '#8FE3FF']
        }
    }, {
        name: 'nonDisease',
        type: 'consequence',
        selected: false,
        options: {
          labels: ['Likely benign'],
          colors: ['#99cc00']
        }
    }, {
        name: 'uncertain',
        type: 'consequence',
        selected: false,
        options: {
          labels: ['Uncertain'],
          colors: ['#FFCC00']
        }
    }, {
        name: 'UniProt',
        type: 'provenance',
        selected: false,
        options: {
          labels: ['UniProt reviewed'],
          colors: ['#e5e5e5']
        }
    }, {
        name: 'ClinVar',
        type: 'provenance',
        selected: false,
        options: {
          labels: ['ClinVar reviewed'],
          colors: ['#e5e5e5']
        }
    }, {
        name: 'LSS',
        type: 'provenance',
        selected: false,
        options: {
          labels: ['Large scale studies'],
          colors: ['#e5e5e5']
        }
    }
];

class ProtvistaFilter extends HTMLElement {
  constructor() {
    super();
    this._selectedFilters = new Set();
  }

  connectedCallback() {
    this.renderFilters();
    this.addEventListener('change', this._onFilterChange);
  }

  disconnectedCallback() {
    this.removeEventListener('change', this._onFilterChange);
  }

  _onFilterChange(event) {
    const { checked, value } = event.detail;
    if (checked) {
      this._selectedFilters.add(value);
    } else {
      this._selectedFilters.delete(value);
    }
    this.dispatchEvent(new CustomEvent('filter-change', {
      bubbles: true,
      composed: true,
      detail: {
        value: [...this._selectedFilters]
      }
    }));
    console.log(this._selectedFilters);
  }

  renderFilters() {
    const provenances  = filters.filter(f => f.type === 'provenance');
    const consequences = filters.filter(f => f.type === 'consequence');

    const template = () => html`
      <h5>Filter Consequence</h5>
      <div style="display: flex; flex-direction: column;">
        ${consequences.map(({name, selected, options}) => {
          return html`
            <protvista-checkbox value="${name}" .options="${options}" disabled></protvista-checkbox>`;
        })}
      </div>
      <h5>Filter Data Provenance</h5>
      <div style="display: flex; flex-direction: column;">
        ${provenances.map(({name, selected, options}) => {
          return html`
            <protvista-checkbox value="${name}" .options="${options}" checked></protvista-checkbox>`;
        })}
      </div>
    `;
    render(template(), this);
  }
}

export default ProtvistaFilter;
