import { html, render } from "lit-html";
import groupBy from "lodash-es/groupBy";

import "./style.css";
import "./checkbox.js";

class ProtvistaFilter extends HTMLElement {
  static get tagName() {
    return "protvista-filter";
  }

  constructor() {
    super();
    this._filters = [];
    this._selectedFilters = new Set();
  }

  get isManaged() {
    return true;
  }

  static get observedAttributes() {
    return ["filters"];
  }

  set filters(filters) {
    this._filters = filters;
    this._filters.forEach(({ name, type, options }) => {
      if (options.selected) {
        this._selectedFilters.add(`${type.name}:${name}`);
      }
    });
    this._renderFilters();
  }

  get filters() {
    return this._filters;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name !== "filters") {
        return;
      }
      this._filters = JSON.parse(newValue);
      this._filters.forEach(({ name, type, options }) => {
        if (options.selected) {
          this._selectedFilters.add(`${type.name}:${name}`);
        }
      });
      this._renderFilters();
    }
  }

  connectedCallback() {
    this._renderFilters();
    this.addEventListener("filterChange", this._onFilterChange);
  }

  disconnectedCallback() {
    this.removeEventListener("filterChange", this._onFilterChange);
  }

  _renderFilters() {
    const groupByType = groupBy(this._filters, f => {
      return f.type.text;
    });

    const flexColumn = children => html`
      <div style="display: flex; flex-direction: column;">
        ${children}
      </div>
    `;

    const flexRow = children => html`
      <div style="display: flex;">
        ${children}
      </div>
    `;

    const header = text => html`
      <h5>${text}</h5>
    `;

    const content = html`
      ${flexColumn(
        Object.keys(groupByType).map(
          type =>
            html`
              ${header(type)}
              ${flexColumn(
                groupByType[type].map(
                  ({ name, type, options }) => html`
                    <protvista-checkbox
                      value="${type.name}:${name}"
                      .options="${options}"
                      ?checked="${options.selected}"
                    ></protvista-checkbox>
                  `
                )
              )}
            `
        )
      )}
    `;

    render(flexRow(content), this);
  }

  _onFilterChange(event) {
    let {
      detail: { checked, value }
    } = event;
    if (checked) {
      this._selectedFilters.add(value);
    } else {
      this._selectedFilters.delete(value);
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: {
          type: "activefilters",
          value: [...this._selectedFilters]
        }
      })
    );
  }

  _fireEvent(event) {
    this.dispatchEvent(event);
  }
}

export default ProtvistaFilter;
