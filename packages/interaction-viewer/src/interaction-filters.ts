/* eslint-disable no-param-reassign */
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";

export type FilterDefinition = {
  name: string;
  label: string;
  items: Record<string, string[]>;
};

@customElement("interaction-filters")
export default class InteractionFilters extends LitElement {
  @property({ type: Object })
  filterConfig?: FilterDefinition[];

  private handleChange(event: Event): void {
    const selectElement = (event.target as HTMLSelectElement).value;
    // TODO also filter out possible values from other filter
    this.dispatchEvent(
      new CustomEvent("filter-select", {
        detail: selectElement ? JSON.parse(selectElement) : [],
        composed: true,
      })
    );
  }

  private handleReset(): void {
    this.dispatchEvent(
      new CustomEvent("filter-select", {
        detail: [],
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    console.log(this.filterConfig);
    return html`
      <form>
        ${this.filterConfig?.map(
          (filterDefinition) => html`
            <label for=${filterDefinition.name}
              >${filterDefinition.label}</label
            >
            <select
              name=${filterDefinition.name}
              id=${filterDefinition.name}
              @change=${this.handleChange}
            >
              <option value="">--Please choose an option--</option>
              ${Object.keys(filterDefinition.items).map(
                (filterItemKey) => html`
                  <option
                    value=${JSON.stringify(
                      filterDefinition.items[filterItemKey]
                    )}
                  >
                    ${filterItemKey}
                  </option>
                `
              )}
            </select>
          </form>
        `
        )}
        <button type="reset" @click=${this.handleReset}>Clear</button>
      </form>
    `;
  }
}
