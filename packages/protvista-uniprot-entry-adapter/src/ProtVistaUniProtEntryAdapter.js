import BasicHelper from './BasicHelper';

export default class ProtVistaUniProtEntryAdapter extends HTMLElement {
    constructor() {
        super();
        this._adaptedData = [];
        this._basicHelper = BasicHelper;
    }

    connectedCallback() {
        this._filters = this.getAttribute('filters') ? this.getAttribute('filters').split(',') : [];
        this._initLoaders();
        this._addLoaderListeners();
    }

    parseEntry(data) {
        //Specialized versions of this generic adapter should implement this method so data is actually transformed
        // and adapted.
        this._adaptedData = data;
        return this._adaptedData;
    }

    filterData() {
        if (this._filters.length > 0) {
            this._adaptedData =
                this._adaptedData.filter(d => {
                    return this._filters.includes(d.type)
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
        let children = this.children;
        if (this.childElementCount !== 1) {
            this.dispatchEvent(new CustomEvent(
                'warning', {
                    detail: 'Only one loader OR adapter is allowed, the first one will be used, the others dismissed',
                    bubbles: true,
                    cancelable: true
                }
            ));
            this._removeChildrenInList(this, children, 1, this.childElementCount);
        }
    }

    _removeChildrenInList(elem, list, start, end) {
        for (let i = start;
            (i < end) && (i < list.length); i++) {
            elem.removeChild(list[i]);
        }
    }

    _addLoaderListeners() {
        this.addEventListener('load', (e) => {
            if (e.target !== this) {
                e.stopPropagation();
                try {
                    if (e.detail.payload.errorMessage) {
                        throw e.detail.payload.errorMessage;
                    }
                    this.parseEntry(e.detail.payload);
                    this.filterData();
                    this.dispatchEvent(new CustomEvent(
                        'load', {
                            detail: {
                                payload: this._adaptedData
                            },
                            bubbles: true,
                            cancelable: true
                        }
                    ));
                } catch (error) {
                    this.dispatchEvent(new CustomEvent(
                        'error', {
                            detail: error,
                            bubbles: true,
                            cancelable: true
                        }
                    ));
                }
            }
        });
    }
}