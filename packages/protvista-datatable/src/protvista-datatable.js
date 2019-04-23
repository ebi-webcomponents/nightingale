import { LitElement, html, css } from "lit-element";
import { v1 } from "uuid";

class ProtvistaDatatable extends LitElement {
  constructor() {
    super();
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.eventHandler);
    console.log("removed");
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
      }
      th {
        text-align: left;
      }
      tbody tr:hover {
        background-color: var(--protvista-datatable__hover, #c0c0c0);
      }
      td {
        cursor: pointer;
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
      this.isWithinRange(this.displayStart, this.displayEnd, start, end)
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
        <tbody>
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
                        <td>${this.columns[column].resolver(row)}</td>
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
