import { LitElement, html, css } from "lit-element";
import { v1 } from "uuid";

class ProtvistaDatatable extends LitElement {
  constructor() {
    super();
    this.height = 15;
    this.eventHandler = this.eventHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("load", e => {
      if (Array.from(this.children).includes(e.target)) {
        this.data = this.processData(e.detail.payload.features);
      }
    });
    document.addEventListener("click", this.eventHandler);
    this.classList.add("feature"); //this makes sure the protvista-zoomable event listener doesn't reset
    window.addEventListener("resize", this.updateHeaderColumnSizes.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.eventHandler);
  }

  // Implement our own accessors as we need to transform the data
  set data(value) {
    let oldValue = this._data;
    this._data = this.processData(value);
    this.requestUpdate("data", oldValue);
  }

  get data() {
    return this._data;
  }

  eventHandler(e) {
    if (!e.target.closest("protvista-datatable")) {
      this.clickedRowId = null;
    }
  }

  static get properties() {
    return {
      data: { type: Object },
      highlight: {
        converter: value => {
          if (value && value !== "null") {
            return value.split(":").map(d => parseInt(d));
          } else {
            return null;
          }
        }
      },
      height: { type: Number },
      columns: { type: Object },
      displayStart: { type: Number },
      displayEnd: { type: Number },
      clickedRowId: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      table {
        width: 100%;
        padding: 0;
        margin: 0;
        border-spacing: 0;
      }

      th {
        text-align: left;
        background-color: var(--protvista-datable__header-background, #fff);
        color: var(--protvista-datable__header-text, #393b42);
        text-overflow: ellipsis;
      }

      td,
      th {
        padding: 1rem;
        border-bottom: 1px solid #c2c4c4;
      }

      thead {
        display: block;
      }

      tbody {
        display: block;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }

      tr:hover {
        background-color: var(--protvista-datatable__hover, #f1f1f1);
      }

      td {
        cursor: pointer;
        width: 20%;
      }

      .active {
        background-color: var(
          --protvista-datatable__active,
          rgba(255, 235, 59, 0.3)
        );
      }
      .active-clicked {
        background-color: var(
          --protvista-datatable__active--clicked,
          rgba(255, 235, 59, 0.8)
        );
      }
      .hidden {
        opacity: 0.2;
      }
    `;
  }

  get isManaged() {
    return true;
  }

  processData(data) {
    return data
      .sort((a, b) => a.start - b.start)
      .map(d => {
        return { ...d, id: v1() };
      });
  }

  isWithinRange(rangeStart, rangeEnd, start, end) {
    return rangeStart >= end || rangeEnd <= start;
  }

  isOutside(rangeStart, rangeEnd, start, end) {
    return rangeStart > end || rangeEnd < start;
  }

  handleClick(e, start, end) {
    this.clickedRowId = e.target.parentNode.dataset.uuid;
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
    if (this.clickedRowId && this.clickedRowId === id) {
      className = `${className} active-clicked`;
    }
    if (
      this.displayStart &&
      this.displayEnd &&
      this.isOutside(this.displayStart, this.displayEnd, start, end)
    ) {
      className = `${className} hidden`;
    }
    if (
      this.highlight &&
      !this.isWithinRange(this.highlight[0], this.highlight[1], start, end)
    ) {
      className = `${className} active`;
    }
    return className;
  }

  updateHeaderColumnSizes() {
    // Calculate column widths to apply to header
    const firstRow = this.shadowRoot.querySelectorAll("table > tbody > tr")[0];
    const columnWidths = [...firstRow.children].map(
      el => el.getBoundingClientRect().width
    );
    const header = this.shadowRoot.querySelector("table > thead > tr");
    [...header.children].forEach((el, i) => {
      el.style.width = `${columnWidths[i]}px`;
    });
  }

  updated() {
    this.updateHeaderColumnSizes();
  }

  render() {
    if (!this.data || !this.columns) {
      return null;
    }
    return html`
      <table>
        <thead>
          <tr>
            ${Object.values(this.columns).map(
              column =>
                html`
                  <th>${column.label}</th>
                `
            )}
          </tr>
        </thead>
        <tbody style="height:${this.height}rem">
          ${this.data.map(
            row =>
              html`
                <tr
                  data-uuid=${row.id}
                  class=${this.getStyleClass(row.id, row.start, row.end)}
                  @click="${e => this.handleClick(e, row.start, row.end)}"
                >
                  ${Object.keys(this.columns).map(
                    column =>
                      html`
                        <td>
                          ${this.columns[column].resolver(row)}
                        </td>
                      `
                  )}
                </tr>
              `
          )}
        </tbody>
      </table>
    `;
  }
}

export default ProtvistaDatatable;
