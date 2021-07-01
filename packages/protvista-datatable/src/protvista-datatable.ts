import { LitElement, html } from "lit-element";
import { v1 } from "uuid";
import { ScrollFilter } from "protvista-utils";

import { ProtvistaLoadEvent } from "./types/events";
import { ProtvistaManager } from "./types/manager";

import styles from "./styles";

type DataTableData<Datum> = {
  start?: number;
  begin?: number;
  end: number;
} & Datum;

type Columns = {
  [key: string]: {
    label: string;
    resolver: (d: any) => HTMLTemplateElement;
  };
};

class ProtvistaDatatable extends LitElement {
  private height: number;

  private _data: DataTableData<any>[]; // or "data"?

  private highlight: [number, number][];

  private columns: Columns;

  private displayStart?: number;

  private displayEnd?: number;

  private selectedid?: string;

  private visibleChildren: string[];

  private noScrollToRow: boolean;

  private noDeselect: boolean;

  private scrollFilter: any; // to replace with type definition from utils when exists

  private wheelListener: (e: WheelEvent) => any;

  private manager: ProtvistaManager;

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
        this.data = ProtvistaDatatable.processData(e.detail.payload.features);
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
  set data(value: DataTableData<any>[]) {
    const oldValue = this._data;
    this._data = ProtvistaDatatable.processData(value);
    this.requestUpdate("data", oldValue);
  }

  get data(): DataTableData<any> {
    return this._data;
  }

  eventHandler(e: MouseEvent) {
    if (
      !e.target.closest("protvista-datatable") &&
      !e.target.closest(".feature")
    ) {
      this.selectedid = null;
    }
  }

  static get properties() {
    return {
      data: { type: Object },
      highlight: {
        converter: (value) => {
          if (value && value !== "null") {
            return value.split(":").map((d) => Number(d));
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

  static get styles() {
    return styles;
  }

  static processData(data) {
    return data
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

  static isWithinRange(rangeStart, rangeEnd, start, end) {
    return (
      (!start && rangeEnd === Number(end)) ||
      (!end && rangeStart === Number(start)) ||
      (rangeStart <= start && rangeEnd >= end)
    );
  }

  static isOutside(rangeStart, rangeEnd, start, end) {
    return rangeStart > end || rangeEnd < start;
  }

  handleClick(e, row) {
    if (!e.target.parentNode) {
      return;
    }
    const { start, end } = row;
    const detail =
      (typeof this.rowClickEvent === "function" && this.rowClickEvent(row)) ||
      {};
    this.selectedid = e.target.parentNode.dataset.id;
    if (start && end) {
      detail.highlight = `${start}:${end}`;
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        cancelable: true,
      })
    );
  }

  getStyleClass(id, start, end) {
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
        start,
        end
      )
    ) {
      className = `${className} hidden`;
    }
    if (
      this.highlight &&
      ProtvistaDatatable.isWithinRange(
        this.highlight[0],
        this.highlight[1],
        start,
        end
      )
    ) {
      className = `${className} overlapped`;
    }
    return className;
  }

  hasChildData(rowItems, row) {
    return rowItems.some((column) => this.columns[column].resolver(row));
  }

  toggleVisibleChild(rowId) {
    if (this.visibleChildren.includes(rowId)) {
      this.visibleChildren = this.visibleChildren.filter(
        (childId) => childId !== rowId
      );
    } else {
      this.visibleChildren = [...this.visibleChildren, rowId];
    }
  }

  scrollIntoView() {
    if (!this.selectedid) {
      return;
    }
    const element = this.shadowRoot.querySelector(
      `[data-id="${this.selectedid}"]`
    );
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  getChildRow(childRowItems, row) {
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

  render() {
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
            ${this.data.map((row, rowIndex) => {
              const hasChildData = this.hasChildData(childRowItems, row);
              return html`
                <tr
                  data-id="${row.protvistaFeatureId}"
                  class="${this.getStyleClass(
                    row.protvistaFeatureId,
                    row.start,
                    row.end
                  )} ${rowIndex % 2 === 1 ? "even" : "odd"}"
                  @click="${(e) => this.handleClick(e, row)}"
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

  updated() {
    if (!this.noScrollToRow) {
      this.scrollIntoView();
    }
  }
}

export default ProtvistaDatatable;
