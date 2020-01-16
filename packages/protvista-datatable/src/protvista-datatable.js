import { LitElement, html } from "lit-element";
/* eslint-disable import/extensions, import/no-extraneous-dependencies */
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import { v1 } from "uuid";
import styles from "./styles";
import PlusSVG from "../resources/plus.svg";
import MinusSVG from "../resources/minus.svg";

const getRowId = (rowId, row) =>
  `protvista_id_${rowId ? rowId.resolver(row) : row.featureId}`;

class ProtvistaDatatable extends LitElement {
  constructor() {
    super();
    this.height = 25;
    this.visibleChildren = [];
    this.eventHandler = this.eventHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("load", e => {
      if (Array.from(this.children).includes(e.target)) {
        this.data = ProtvistaDatatable.processData(e.detail.payload.features);
      }
    });
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
    document.addEventListener("click", this.eventHandler);
    // this makes sure the protvista-zoomable event listener doesn't reset
    this.classList.add("feature");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.manager) {
      this.manager.unregister(this);
    }
    document.removeEventListener("click", this.eventHandler);
  }

  // Implement our own accessors as we need to transform the data
  set data(value) {
    const oldValue = this._data;
    this._data = ProtvistaDatatable.processData(value);
    this.requestUpdate("data", oldValue);
  }

  get data() {
    return this._data;
  }

  eventHandler(e) {
    if (
      !e.target.closest("protvista-datatable") &&
      !e.target.closest(".feature")
    ) {
      this.selectedid = null;
    }
  }

  static get properties() {
    return {
      data: { type: Object },
      highlight: {
        converter: value => {
          if (value && value !== "null") {
            return value.split(":").map(d => Number(d));
          }
          return null;
        }
      },
      height: { type: Number },
      columns: { type: Object },
      displayStart: { type: Number },
      displayEnd: { type: Number },
      visibleChildren: { type: Array },
      selectedid: { type: String }
    };
  }

  static get styles() {
    return styles;
  }

  static processData(data) {
    return data
      .map(d => {
        return {
          ...d,
          start: d.start ? d.start : d.begin
        };
      })
      .sort((a, b) => a.start - b.start)
      .map(d => ({ ...d, featureId: d.featureId ? d.featureId : v1() }));
  }

  static isWithinRange(rangeStart, rangeEnd, start, end) {
    return (
      (!start && rangeEnd === Number(end)) ||
      (!end && rangeStart === Number(start)) ||
      (rangeStart <= start && rangeEnd >= end)
    );
  }

  static isOutside(rangeStart, rangeEnd, start, end) {
    return rangeStart > end || rangeEnd < start;
  }

  handleClick(e, start, end) {
    if (!e.target.parentNode) {
      return;
    }
    this.selectedid = null;
    this.selectedid = e.target.parentNode.id;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          highlight: `${start}:${end}`
        },
        bubbles: true,
        cancelable: true
      })
    );
  }

  getStyleClass(id, start, end) {
    let className = "";
    if (this.selectedid && this.selectedid === id) {
      className = `${className} active`;
    }
    if (
      this.displayStart &&
      this.displayEnd &&
      ProtvistaDatatable.isOutside(
        this.displayStart,
        this.displayEnd,
        start,
        end
      )
    ) {
      className = `${className} hidden`;
    }
    if (
      this.highlight &&
      ProtvistaDatatable.isWithinRange(
        this.highlight[0],
        this.highlight[1],
        start,
        end
      )
    ) {
      className = `${className} overlapped`;
    }
    return className;
  }

  hasChildData(rowItems, row) {
    return rowItems.some(column => this.columns[column].resolver(row));
  }

  toggleVisibleChild(rowId) {
    if (this.visibleChildren.includes(rowId)) {
      this.visibleChildren = this.visibleChildren.filter(
        childId => childId !== rowId
      );
    } else {
      this.visibleChildren = [...this.visibleChildren, rowId];
    }
  }

  scrollIntoView() {
    if (!this.selectedid) {
      return;
    }
    const element = this.shadowRoot.querySelector(`#${this.selectedid}`);
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getChildRow(childRowItems, row) {
    return html`
      <tr class="child-row">
        <td
          colspan="${Object.values(this.columns).filter(column => !column.child)
            .length + 1}"
        >
          ${childRowItems.map(column => {
            const data = this.columns[column].resolver(row);
            return data
              ? html`
                  <div class="protvista-datatable__child-item">
                    <div class="protvista-datatable__child-item__title">
                      ${this.columns[column].label}
                    </div>
                    <div class="protvista-datatable__child-item__content">
                      ${this.columns[column].resolver(row)}
                    </div>
                  </div>
                `
              : html``;
          })}
        </td>
      </tr>
    `;
  }

  render() {
    if (!this.data || !this.columns) {
      return html``;
    }
    const childRowItems = Object.keys(this.columns).filter(
      column => this.columns[column].child
    );
    const columnsToDisplay = Object.values(this.columns).filter(
      column => !column.child && column.display !== false
    );
    const { rowId } = this.columns;
    return html`
      <div
        class="protvista-datatable-container"
        style="height:${this.height}rem"
      >
        <table>
          <thead>
            <tr>
              <th></th>
              ${columnsToDisplay.map(
                column =>
                  html`
                    <th>${column.label}</th>
                  `
              )}
            </tr>
          </thead>
          <tbody>
            ${this.data.map(row => {
              const hasChildData = this.hasChildData(childRowItems, row);
              return html`
                <tr
                  id=${getRowId(rowId, row)}
                  class=${this.getStyleClass(
                    getRowId(rowId, row),
                    row.start,
                    row.end
                  )}
                  @click="${e => this.handleClick(e, row.start, row.end)}"
                >
                  ${hasChildData
                    ? html`
                        <td
                          class="protvista-datatable__child-toggle"
                          @click="${() =>
                            this.toggleVisibleChild(getRowId(rowId, row))}"
                        >
                          ${this.visibleChildren.includes(getRowId(rowId, row))
                            ? unsafeHTML(MinusSVG)
                            : unsafeHTML(PlusSVG)}
                        </td>
                      `
                    : html`
                        <td />
                      `}
                  ${columnsToDisplay.map(
                    column =>
                      html`
                        <td>
                          ${column.resolver(row)}
                        </td>
                      `
                  )}
                </tr>
                ${hasChildData &&
                this.visibleChildren.includes(getRowId(rowId, row))
                  ? this.getChildRow(childRowItems, row)
                  : ""}
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  updated() {
    this.scrollIntoView();
  }
}

export default ProtvistaDatatable;
