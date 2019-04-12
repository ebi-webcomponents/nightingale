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
          return value.split(":");
        }
      }
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
      td {
        cursor: pointer;
      }
      .active {
        background: yellow;
      }
    `;
  }

  get isManaged() {
    return true;
  }

  processData(data) {
    return data.sort((a, b) => a.start - b.start);
  }

  isWithinRange(highlight, start, end) {
    return highlight[0] <= start && highlight[1] >= end;
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
                  class=${this.highlight &&
                  this.isWithinRange(this.highlight, row.start, row.end)
                    ? "active"
                    : ""}
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
