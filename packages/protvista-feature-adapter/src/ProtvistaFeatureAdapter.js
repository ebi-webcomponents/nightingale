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
    this._initLoaders();
    this._addLoaderListeners();
  }

  set data(data) {
    this._emitEvent(data);
  }

  parseEntry(data) {
    this._adaptedData = data.features;

    if (this._adaptedData && this._adaptedData.length !== 0) {
      this._adaptedData = this._basicHelper.renameProperties(this._adaptedData);
      this._adaptedData.map(
        d => (d.tooltipContent = this._basicHelper.formatTooltip(d))
      );
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

  _initLoaders() {
    const { children } = this;
    if (this.childElementCount !== 1) {
      this.dispatchEvent(
        new CustomEvent("warning", {
          detail:
            "Only one loader OR adapter is allowed, the first one will be used, the others dismissed",
          bubbles: true,
          cancelable: true
        })
      );
      this._removeChildrenInList(this, children, 1, this.childElementCount);
    }
  }

  _removeChildrenInList(elem, list, start, end) {
    for (let i = start; i < end && i < list.length; i++) {
      elem.removeChild(list[i]);
    }
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
