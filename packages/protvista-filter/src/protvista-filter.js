import { html, render } from "lit-html";
import groupBy from 'lodash-es/groupBy';

import './style.css';
import './checkbox.js';
import filters, { getFilter } from './filters';


class ProtvistaFilter extends HTMLElement {
  static get tagName() {
    return 'protvista-filter';
  }

  constructor() {
    super();
    this._selectedFilters = new Set();
  }

  connectedCallback() {
    filters.forEach(({name, options}) => {
      if (options.selected) {
        this._selectedFilters.add(name);
      }
    });
    this.renderFilters();
    this.addEventListener('filter-change', this._onFilterChange);
  }

  disconnectedCallback() {
    this.removeEventListener('filter-change', this._onFilterChange);
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

    const flexRow = (children) => html `
      <div style="display: flex;">
        ${children}
      </div>
    `;

    const header = (text) => html `
      <h5>${text}</h5>
    `;

    const filter = html `
      ${flexColumn(Object.keys(groupByType).map((type) =>
        html `
          ${header(type)}
          ${flexColumn(
            groupByType[type].map(({name, options}) => html`
              <protvista-checkbox
                  value="${name}"
                  .options="${options}"
                  ?checked="${options.selected}"></protvista-checkbox>`
            )
          )}
        `
      ))}
    `;

    const content = html`
      ${filter}
    `;

    render(flexRow(content), this);
  }

  _onFilterChange(event) {
    let { detail: {checked, value} } = event;
    if (checked) {
      this._selectedFilters.add(value);
    } else {
      this._selectedFilters.delete(value);
    }
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'filters',
        value: [...this._selectedFilters]
      }
    }));
    //console.log('On filter change', this._selectedFilters);
  }

  get isManaged() {
    return true;
  }

  _onLoadData(event) {
    //console.log("In filter", event.detail.payload);
    //console.log("In filter", getFilter('disease'));
    const filteredData = getFilter('disease').forEach(f => {
      return f.options.applyFilter(event.detail.payload);
    });
    //console.log(filteredData);
  }

  _fireEvent(event) {
    this.dispatchEvent(event);
  }
}

export default ProtvistaFilter;
