import { LitElement, html, css } from "lit-element";

const columnConfig = {
  type: {
    label: "Feature key"
  },
  description: {
    label: "Description"
  },
  start: {
    label: "Start"
  },
  end: {
    label: "End"
  }
};

class ProtvistaDatatable extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("load", e => {
      if (Array.from(this.children).includes(e.target)) {
        this.data = e.detail.payload;
      }
    });
  }

  static get properties() {
    return {
      data: { type: Array },
      highlight: {
        converter: (value, type) => {
          if (value && value !== "null") {
            return value.split(":").map(d => parseInt(d));
          } else {
            return null;
          }
        }
      },
      displayStart: { type: Number },
      displayEnd: { type: Number }
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
      tr:hover {
        background-color: var(--protvista-datatable__hover, #c0c0c0);
      }
      td {
        cursor: pointer;
      }
      .active {
        background-color: var(--protvista-datatable__active, yellow);
      }
      .active-clicked {
        background-color: var(--protvista-datatable__active--clicked, yellow);
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
    return data.sort((a, b) => a.start - b.start);
  }

  isWithinRange(rangeStart, rangeEnd, start, end) {
    return rangeStart >= end || rangeEnd <= start;
  }

  handleClick(start, end) {
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

  getStyleClass(start, end) {
    let className = "";
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
    if (!this.data) {
      return null;
    }
    const processedData = this.processData(this.data.features);
    return html`
      <table>
        <thead>
          <tr>
            ${Object.values(columnConfig).map(
              column =>
                html`
                  <th>${column.label}</th>
                `
            )}
          </tr>
        </thead>
        <tbody>
          ${processedData.map(
            row =>
              html`
                <tr
                  class=${this.getStyleClass(row.start, row.end)}
                  @click="${() => this.handleClick(row.start, row.end)}"
                >
                  ${Object.keys(columnConfig).map(
                    column =>
                      html`
                        <td>${row[column]}</td>
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
