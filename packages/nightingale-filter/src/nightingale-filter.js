import { LitElement, html, css } from "lit-element";
import groupBy from "lodash-es/groupBy";

class NightingaleFilter extends LitElement {
  static is = "nightingale-filter";

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

      .nightingale_checkbox {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin-top: 10px;
        line-height: 24px;
        outline: none;
      }

      .nightingale_checkbox_input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      .checkmark {
        opacity: 0.4;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #bdc3c7;
      }

      .nightingale_checkbox_input:checked ~ .checkmark {
        opacity: 1;
      }

      .nightingale_checkbox_label {
        margin-left: 0.2rem;
        line-height: 1rem;
      }
    `;
  }

  render() {
    const groupByType = groupBy(this.filters, (f) => f.type.text);
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
    const isCompound = options.colors.length > 1;
    return html`
      <label
        class="nightingale_checkbox ${isCompound ? "compound" : ""}"
        tabindex="0"
      >
        <input
          type="checkbox"
          class="nightingale_checkbox_input"
          ?checked="true"
          .value="${name}"
          @change="${() => this.toggleFilter(name)}"
        />
        <span
          class="checkmark"
          style=${`background: ${
            isCompound
              ? `
            linear-gradient(${options.colors[0]},
            ${options.colors[1]})
          `
              : options.colors[0]
          };`}
        ></span>
        <span class="nightingale_checkbox_label"> ${labels.join("/")} </span>
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
  }
}

export default NightingaleFilter;
