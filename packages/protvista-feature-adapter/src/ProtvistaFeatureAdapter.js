import BasicHelper from "./BasicHelper";

class ProtvistaFeatureAdapter extends HTMLElement {
  constructor() {
    super();
    this._adaptedData = [];
    this._basicHelper = BasicHelper;
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
    const { features } = data;
    if (features && features.length > 0) {
      this._adaptedData = features.map(feature => {
        return {
          ...feature,
          tooltipContent: this._basicHelper.formatTooltip(feature)
        };
      });
      this._adaptedData = this._basicHelper.renameProperties(this._adaptedData);
    }
    return this._adaptedData;
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

  get basicHelper() {
    return this._basicHelper;
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
