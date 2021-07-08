import {
  LitElement,
  html,
  TemplateResult,
  CSSResult,
  PropertyDeclarations,
} from "lit-element";
import { v1 } from "uuid";
import { ScrollFilter } from "protvista-utils";
import { RequireAtLeastOne } from "type-fest";

import { ProtvistaLoadEvent } from "./types/events";
import { ProtvistaManager } from "./types/manager";

import styles from "./styles";

type StartTypes = {
  start?: number;
  begin?: number;
};

type DataTableDatum = {
  end: number;
  protvistaFeatureId?: string;
} & RequireAtLeastOne<StartTypes, "begin" | "start">;

type Columns = {
  [key: string]: {
    label: string;
    child?: boolean;
    display?: boolean;
    resolver: (d: any) => HTMLTemplateElement;
  };
};

class ProtvistaDatatable<T extends DataTableDatum> extends LitElement {
  private height: number;

  private _data: T[];

  // This will eventually be an array of tuples
  private highlight: [start: number, end: number];

  private columns: Columns;

  private displayStart?: number;

  private displayEnd?: number;

  private selectedid?: string;

  private visibleChildren: string[];

  private noScrollToRow: boolean;

  private noDeselect: boolean;

  private scrollFilter: any; // to replace with type definition from utils when exists

  private wheelListener: (e: WheelEvent) => any;

  private rowClickEvent?: (row: T) => void;

  private manager: ProtvistaManager;

  static get is(): string {
    return "protvista-datatable";
  }

  constructor() {
    super();
    this.height = 25;
    this.visibleChildren = [];
    this.noScrollToRow = false;
    this.noDeselect = false;
    this.scrollFilter = new ScrollFilter(this);
    this.wheelListener = (event) => this.scrollFilter.wheel(event);
    this.eventHandler = this.eventHandler.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("load", (e: ProtvistaLoadEvent) => {
      if (Array.from(this.children).includes(e.target as HTMLElement)) {
        this.data = e.detail.payload.features;
      }
    });
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
    if (!this.noDeselect) {
      document.addEventListener("click", this.eventHandler);
    }
    // this makes sure the protvista-zoomable event listener doesn't reset
    this.classList.add("feature");

    if (this.hasAttribute("filter-scroll")) {
      document.addEventListener("wheel", this.wheelListener, { capture: true });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.manager) {
      this.manager.unregister(this);
    }
    document.removeEventListener("click", this.eventHandler);
    document.removeEventListener("wheel", this.wheelListener);
  }

  // Implement our own accessors as we need to transform the data
  set data(value: T[]) {
    const oldValue = this._data;
    this._data = this.processData(value);
    this.requestUpdate("data", oldValue);
  }

  get data(): T[] {
    return this._data;
  }

  eventHandler(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest("protvista-datatable") && !target.closest(".feature")) {
      this.selectedid = null;
    }
  }

  static get properties(): PropertyDeclarations {
    return {
      data: { type: Object },
      highlight: {
        converter: (value: string) => {
          if (value && value !== "null") {
            try {
              const splitArray = value.split(":").map((d) => Number(d));
              if (splitArray.length !== 2) {
                throw new Error(
                  "Highlight should be only 2 values separated by ':'."
                );
              }
              return [splitArray[0], splitArray[1]];
            } catch (e) {
              console.error("Invalid highlight coordinates:", e);
            }
          }
          return null;
        },
      },
      height: { type: Number },
      columns: { type: Object },
      displayStart: { type: Number },
      displayEnd: { type: Number },
      visibleChildren: { type: Array },
      selectedid: { type: String },
      rowClickEvent: { type: Function },
      noScrollToRow: { type: Boolean },
      noDeselect: { type: Boolean },
    };
  }

  static get styles(): CSSResult {
    return styles;
  }

  // eslint-disable-next-line class-methods-use-this
  processData(dataToProcess: T[]): T[] {
    return dataToProcess
      .map((d) => {
        return {
          ...d,
          start: d.start ? d.start : d.begin,
        };
      })
      .sort((a, b) => a.start - b.start)
      .map((d) => ({
        ...d,
        protvistaFeatureId: d.protvistaFeatureId || v1(),
      }));
  }

  static isWithinRange(
    rangeStart: number,
    rangeEnd: number,
    start: number,
    end: number
  ): boolean {
    return (
      (!start && rangeEnd === end) ||
      (!end && rangeStart === start) ||
      (rangeStart <= start && rangeEnd >= end)
    );
  }

  static isOutside(
    rangeStart: number,
    rangeEnd: number,
    start: number,
    end: number
  ): boolean {
    return rangeStart > end || rangeEnd < start;
  }

  handleClick(e: MouseEvent, row: T): void {
    const target = e.target as HTMLElement;
    if (!target.parentNode) {
      return;
    }
    const { start, end } = row;
    if (this.rowClickEvent && typeof this.rowClickEvent === "function") {
      // Note: not sure this is used or is the best way to handle if it is...
      this.rowClickEvent(row);
    }
    this.selectedid = (target.parentNode as HTMLElement).dataset.id;
    const detail = start && end ? { highlight: `${start}:${end}` } : {};
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  getStyleClass(id: string, start: number, end: number): string {
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
        Number(start),
        Number(end)
      )
    ) {
      className = `${className} hidden`;
    }
    if (
      this.highlight &&
      ProtvistaDatatable.isWithinRange(
        this.highlight[0],
        this.highlight[1],
        Number(start),
        Number(end)
      )
    ) {
      className = `${className} overlapped`;
    }
    return className;
  }

  hasChildData(rowItems: string[], row: T): boolean {
    return rowItems.some((column) => this.columns[column].resolver(row));
  }

  toggleVisibleChild(rowId: string): void {
    if (this.visibleChildren.includes(rowId)) {
      this.visibleChildren = this.visibleChildren.filter(
        (childId) => childId !== rowId
      );
    } else {
      this.visibleChildren = [...this.visibleChildren, rowId];
    }
  }

  scrollIntoView(): void {
    if (!this.selectedid) {
      return;
    }
    const element = this.shadowRoot.querySelector(
      `[data-id="${this.selectedid}"]`
    );
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getChildRow(childRowItems: string[], row: T): TemplateResult {
    return html`
      <tr class="child-row">
        <td
          colspan="${Object.values(this.columns).filter(
            (column) => !column.child
          ).length + 1}"
        >
          ${childRowItems.map((column) => {
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

  render(): TemplateResult {
    if (!this.data || !this.columns) {
      return html``;
    }
    const childRowItems = Object.keys(this.columns).filter(
      (column) => this.columns[column].child
    );
    const columnsToDisplay = Object.values(this.columns).filter(
      (column) => !column.child && column.display !== false
    );
    return html`
      <div
        class="protvista-datatable-container"
        style="height:${this.height}rem"
      >
        <table>
          <thead>
            <tr>
              ${columnsToDisplay.map(
                (column) => html` <th>${column.label}</th> `
              )}
            </tr>
          </thead>
          <tbody>
            ${this.data.map((row, rowIndex: number) => {
              const hasChildData = this.hasChildData(childRowItems, row);
              return html`
                <tr
                  data-id="${row.protvistaFeatureId}"
                  class="${this.getStyleClass(
                    row.protvistaFeatureId,
                    row.start,
                    row.end
                  )} ${rowIndex % 2 === 1 ? "even" : "odd"}"
                  @click="${(e: MouseEvent) => this.handleClick(e, row)}"
                >
                  ${columnsToDisplay.map((column, index) =>
                    hasChildData && index === 0
                      ? html`
                          <td
                            title="View more"
                            @click="${() =>
                              this.toggleVisibleChild(row.protvistaFeatureId)}"
                            class="${this.visibleChildren.includes(
                              row.protvistaFeatureId
                            )
                              ? "withChildren minus"
                              : "withChildren plus"}"
                          >
                            ${column.resolver(row)}
                          </td>
                        `
                      : html` <td>${column.resolver(row)}</td> `
                  )}
                </tr>
                ${hasChildData &&
                this.visibleChildren.includes(row.protvistaFeatureId)
                  ? this.getChildRow(childRowItems, row)
                  : ""}
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  updated(): void {
    if (!this.noScrollToRow) {
      this.scrollIntoView();
    }
  }
}

export default ProtvistaDatatable;
