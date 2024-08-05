import { LitElement, html, css } from "lit-element";
import groupBy from "lodash-es/groupBy";

class ProtvistaFilter extends LitElement {
  static get properties() {
    return {
      filters: { type: Array },
      selectedFilters: { type: Set },
      for: { type: String },
    };
  }

  constructor() {
    super();
    this.filters = [];
    this.selectedFilters = new Set();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("filterChange", this._onFilterChange);
    if (this.closest("nightingale-manager")) {
      this.manager = this.closest("nightingale-manager");
      this.manager.register(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.manager) {
      this.manager.unregister(this);
    }
    this.removeEventListener("filterChange", this._onFilterChange);
  }

  static get styles() {
    return css`
      :host {
        font-size: 0.8rem;
      }

      :host[disabled] {
        opacity: 0.5;
      }

      .protvista_checkbox {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin-top: 10px;
        line-height: 24px;
        border-radius: 25px;
      }

      .protvista_checkbox_input {
        position: absolute;
        cursor: pointer;
        height: 0;
        width: 0;
        opacity: 0.4;
      }

      .protvista_checkbox_label {
        padding: 10px;
        line-height: 1rem;
      }
    `;
  }

  render() {
    const groupByType = groupBy(this.filters, (f) => {
      return f.type.text;
    });
    return html`
      ${Object.keys(groupByType).map(
        (type) =>
          html`
            <h4>${type}</h4>
            <div>
              ${groupByType[type].map(
                (filterItem) => html` ${this.getCheckBox(filterItem)} `
              )}
            </div>
          `
      )}
    `;
  }

  getCheckBox(filterItem) {
    const { name, options } = filterItem;
    const { labels } = options;

    if (options.colors.length == null) {
      options.colors = [options.colors];
    }

    /* TODO Restore the color gradient for isCompound
    const isCompound = options.colors.length > 1;

    Removed:
    style=${`background: ${
            isCompound
              ? `
            linear-gradient(${options.colors[0]},
            ${options.colors[1]})
          `
              : options.colors[0]
          };`}
    */

    const hexToRgba = (hex, alpha = 1) => {
      const red = parseInt(hex.slice(1, 3), 16);
      const green = parseInt(hex.slice(3, 5), 16);
      const blue = parseInt(hex.slice(5, 7), 16);

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    };

    return html`
      <label
        class="protvista_checkbox"
        style=${`
          outline: ${`1px solid ${options.colors[0]}`}; 
          background: ${
            this.selectedFilters.has(name)
              ? hexToRgba(options.colors[0], 0.4)
              : "white"
          };
          `}
        tabindex="0"
      >
        <input
          type="checkbox"
          class="protvista_checkbox_input"
          ?checked="true"
          .value="${name}"
          @change="${() => this.toggleFilter(name)}"
        />
        <span class="protvista_checkbox_label"> ${labels.join("/")} </span>
      </label>
    `;
  }

  toggleFilter(name) {
    if (!this.selectedFilters.has(name)) {
      this.selectedFilters.add(name);
    } else {
      this.selectedFilters.delete(name);
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: {
          type: "filters",
          handler: "property",
          for: this.for,
          value: this.filters
            .filter((filter) => this.selectedFilters.has(filter.name))
            .map((filter) => ({
              category: filter.type.name,
              filterFn: filter.filterData,
            })),
        },
      })
    );

    // Re-render the component to reflect the background colour for the checkboxes
    this.requestUpdate();
  }
}

export default ProtvistaFilter;
