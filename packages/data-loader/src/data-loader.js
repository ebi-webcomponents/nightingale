const observerConfig = {childList: true};

const getSourceUrls = ({children}) => [...children]
  .filter(child => child.tagName === 'SOURCE' && child.src)
  .map(source => source.src);

class DataLoader extends HTMLElement {
  async _fetch () {
    const urls = getSourceUrls(this);
    if (!urls.length) return;

    let detail = [];
    let failed = true;
    for (const url of urls) {
      try {
        const response = await fetch(url);
        detail = await response.json();
        failed = false;
        break;
      } catch (error) {
        detail.push(error);
      }
    }

    this.dispatchEvent(new CustomEvent(
      failed ? 'error' : 'load',
      {detail, bubbles: true}
    ));
    this._data = failed ? null : detail;
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

  // Custom element reactions
  constructor () {
    super();
    this._src = null;
    this._data = null;
    this._observer = new MutationObserver(() => this._planFetch());
    this._selector = this.querySelectorAll('source');
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
