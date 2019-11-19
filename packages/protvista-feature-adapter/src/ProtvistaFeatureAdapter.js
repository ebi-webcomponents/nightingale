import { formatTooltip, renameProperties } from "./BasicHelper";

export const transformData = data => {
  let transformedData = [];
  const { features } = data;
  if (features && features.length > 0) {
    transformedData = features.map(feature => {
      return {
        ...feature,
        tooltipContent: formatTooltip(feature)
      };
    });
    transformedData = renameProperties(transformedData);
  }
  return transformedData;
};

class ProtvistaFeatureAdapter extends HTMLElement {
  constructor() {
    super();
    this._adaptedData = [];
  }

  connectedCallback() {
    this._filters = this.getAttribute("filters")
      ? this.getAttribute("filters").split(",")
      : [];
    this._addLoaderListeners();
  }

  set data(data) {
    this._emitEvent(data);
  }

  parseEntry(data) {
    this._adaptedData = transformData(data);
  }

  filterData() {
    if (Array.isArray(this._adaptedData) && this._filters.length > 0) {
      this._adaptedData = this._adaptedData.filter(d => {
        return this._filters.includes(d.type);
      });
    }
  }

  get adaptedData() {
    return this._adaptedData;
  }

  _emitEvent(data) {
    this.parseEntry(data);
    this.filterData();
    this.dispatchEvent(
      new CustomEvent("load", {
        detail: {
          payload: this._adaptedData
        },
        bubbles: true,
        cancelable: true
      })
    );
  }

  _addLoaderListeners() {
    this.addEventListener("load", e => {
      if (e.target !== this) {
        e.stopPropagation();
        try {
          if (e.detail.payload.errorMessage) {
            throw e.detail.payload.errorMessage;
          }
          this._emitEvent(e.detail.payload);
        } catch (error) {
          this.dispatchEvent(
            new CustomEvent("error", {
              detail: error,
              bubbles: true,
              cancelable: true
            })
          );
        }
      }
    });
  }
}

export default ProtvistaFeatureAdapter;
export { formatTooltip, renameProperties } from "./BasicHelper";
