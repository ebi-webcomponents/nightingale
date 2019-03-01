import { html, render } from "lit-html";
import groupBy from 'lodash-es/groupBy';

import './style.css';
import './checkbox.js';

const filters = [
    {
        name: 'disease',
        type: {
          name: 'consequence',
          text: 'Filter Consequence'
        },
        options: {
          labels: ['Likely disease'],
          colors: ['#990000']
        }
    }, {
        name: 'predicted',
        type: {
          name: 'consequence',
          text: 'Filter Consequence'
        },
        options: {
          labels: ['Predicted (deleterious/benign)', 'Bar'],
          colors: ['#002594', '#8FE3FF'],
        }
    }, {
        name: 'nonDisease',
        type: {
          name: 'consequence',
          text: 'Filter Consequence'
        },
        options: {
          labels: ['Likely benign'],
          colors: ['#99cc00'],
        }
    }, {
        name: 'uncertain',
        type: {
          name: 'consequence',
          text: 'Filter Consequence'
        },
        options: {
          labels: ['Uncertain'],
          colors: ['#FFCC00'],
        }
    }, {
        name: 'UniProt',
        type: {
          name: 'provenance',
          text: 'Filter Provenance'
        },
        options: {
          labels: ['UniProt reviewed'],
          colors: ['#e5e5e5'],
        }
    }, {
        name: 'ClinVar',
        type: {
          name: 'provenance',
          text: 'Filter Provenance'
        },
        options: {
          labels: ['ClinVar reviewed'],
          colors: ['#e5e5e5'],
        }
    }, {
        name: 'LSS',
        type: {
          name: 'provenance',
          text: 'Filter Provenance'
        },
        options: {
          labels: ['Large scale studies'],
          colors: ['#e5e5e5'],
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
    const groupByType = groupBy(filters, (f) => {
      return f.type.text;
    });

    const flexColumn = (children) => html `
      <div style="display: flex; flex-direction: column;">
        ${children}
      </div>
    `;

    const header = (text) => html `
      <h5>${text}</h5>
    `;

    const content = html`
      ${Object.keys(groupByType).map((type) => {
        return html `
          ${header(type)}
          ${flexColumn(
            groupByType[type].map(({name, options}) => {
              return html`
                <protvista-checkbox value="${name}" .options="${options}"></protvista-checkbox>`;
            })
          )}
        `;
      })}
    `;
    render(flexColumn(content), this);
  }
}

export default ProtvistaFilter;
