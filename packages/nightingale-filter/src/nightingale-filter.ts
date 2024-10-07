import { customElement, property } from "lit/decorators.js";
import { html } from "lit";
import groupBy from "lodash-es/groupBy";

import NightingaleElement from "@nightingale-elements/nightingale-new-core";
import NightingaleManager from "@nightingale-elements/nightingale-manager";

export type Filter = {
  name: string;
  type: {
    name: string;
    text: string;
  };
  options: {
    label: string;
    color: string;
  };
  filterData: (data: unknown) => unknown;
};

@customElement("nightingale-filter")
class NightingaleFilter extends NightingaleElement {
  @property({ attribute: false })
  filters?: Filter[] = [];
  @property({ type: String })
  for: string = "";

  #deselected = new Set();
  #manager?: NightingaleManager;

  constructor() {
    super();
    this.filters = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.closest("nightingale-manager")) {
      this.#manager = this.closest("nightingale-manager") as NightingaleManager;
      this.#manager.register(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#manager) {
      this.#manager.unregister(this);
    }
  }

  render() {
    const groupByType = groupBy(this.filters, (f: Filter) => f.type.text);
    return html`
      <style>
        .group {
          margin-bottom: 2.5rem;
        }

        .protvista_checkbox {
          position: relative;
          cursor: pointer;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          margin-top: 10px;
          line-height: 24px;
          outline: none;
        }

        .protvista_checkbox_label {
          margin-left: 0.2rem;
          line-height: 1rem;
        }
      </style>
      ${Object.entries(groupByType).map(
        ([type, group]) => html`
          <h4>${type}</h4>
          <div class="group">
            ${group.map(
              (filterItem) => html` ${this.getCheckBox(filterItem)} `
            )}
          </div>
        `
      )}
    `;
  }

  getCheckBox(filterItem: Filter) {
    const { name, options } = filterItem;
    const { label, color } = options;

    return html`
      <label class="protvista_checkbox" tabindex="0">
        <input
          type="checkbox"
          style=${`accent-color: ${color}`}
          checked
          .value="${name}"
          @change="${() => this.toggleFilter(name)}"
        />
        <span class="protvista_checkbox_label"> ${label} </span>
      </label>
    `;
  }

  toggleFilter(name: string) {
    if (!this.#deselected.has(name)) {
      this.#deselected.add(name);
    } else {
      this.#deselected.delete(name);
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
            ?.filter((f) => !this.#deselected.has(f.name))
            .map((f) => f.name),
        },
      })
    );
  }
}

export default NightingaleFilter;
