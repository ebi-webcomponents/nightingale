import lodashGet from 'lodash-es/get';

const observerConfig = {childList: true};

const getSourceData = ({children}) => [...children]
  .filter(child => (
    child.matches('source[src]') ||
    child.matches('script[type="application/json"]')
  ))
  .map(({src, textContent}) => ({textContent, src}));

class DataLoader extends HTMLElement {
  async _fetch () {
    const sourceData = getSourceData(this);
    if (!sourceData.length) return;

    let detail = [];
    let failed = true;
    for (const sourceDatum of sourceData) {
      try {
        if (sourceDatum.src) {
          const response = await fetch(sourceDatum.src);
          detail = await response.json();
        } else {
          detail = JSON.parse(sourceDatum.textContent);
        }
        failed = false;
        break;
      } catch (error) {
        detail.push(error);
      }
    }

    if (failed) {
      return this.dispatchEvent(
        new CustomEvent('error', {detail, bubbles: true})
      );
    }

    this._data = this._selectorFun(detail);
    return this.dispatchEvent(
      new CustomEvent('load', {detail: this._data, bubbles: true})
    );
  }

  _planFetch () {
    // If fetch is already planned, skip the rest
    if (this._plannedFetch) return;
    this._plannedFetch = true;
    this._data = null;
    setTimeout(() => {
      // Removes the planned fetch flag
      this._plannedFetch = false;
      this._fetch();
    }, 0);
  }

  // Getters/Setters
  // data
  get data () {
    return this._data;
  }

  // loaded
  get loaded () {
    return !!this.data;
  }

  // loaded
  get selector () {
    return this._selector;
  }

  // Custom element reactions
  constructor () {
    super();
    this._src = null;
    this._data = null;
    this._observer = new MutationObserver(() => this._planFetch());
    this._selector = (this.getAttribute('selector') || '').trim();
    if (this._selector) {
      this._selectorFun = data => lodashGet(data, this._selector);
    } else {
      this._selectorFun = data => data;
    }
  }

  connectedCallback () {
    this._observer.observe(this, observerConfig);
    this._planFetch();
  }

  disconnectedCallback () {
    this._plannedFetch = false;
    this._observer.disconnect(this);
  }
}

export default DataLoader;
