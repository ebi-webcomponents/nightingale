/* eslint-disable no-param-reassign */
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";

export type FilterDefinition = {
  name: string;
  label: string;
  items: Record<string, string[]>;
};

export const FILTER_SELECT = "filter-select";

@customElement("interaction-filters")
export default class InteractionFilters extends LitElement {
  @property({ type: Object })
  filterConfig?: FilterDefinition[];

  static styles = css`
    fieldset {
      margin: 0;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      border: none;
    }

    label,
    button {
      margin-bottom: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      margin-right: 1rem;
      display: flex;
      flex-direction: column;
    }
  `;

  private handleChange(event: Event): void {
    const selectElement = (event.target as HTMLSelectElement).value;
    // TODO also filter out possible values from other filter
    this.dispatchEvent(
      new CustomEvent(FILTER_SELECT, {
        detail: selectElement ? JSON.parse(selectElement) : [],
        composed: true,
      })
    );
  }

  private handleReset(): void {
    this.dispatchEvent(
      new CustomEvent(FILTER_SELECT, {
        detail: [],
        composed: true,
      })
    );
  }

  render(): TemplateResult {
    return html`
      <form>
        <fieldset>
          <legend>Filter</legend>
          ${this.filterConfig?.map(
            (filterDefinition) => html`
              <label for=${filterDefinition.name}
                >${filterDefinition.label}
                <select
                  name=${filterDefinition.name}
                  id=${filterDefinition.name}
                  @change=${this.handleChange}
                >
                  <option value="">Select...</option>
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
              </label>
            `
          )}
          <button type="reset" @click=${this.handleReset}>Clear</button>
        </fieldset>
      </form>
    `;
  }
}
