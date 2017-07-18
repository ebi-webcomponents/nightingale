import lodashGet from 'lodash-es/get';

const getSourceData = (...children) => children.filter(
  child => child.matches('source[src], script[type="application/json"]')
);

const fetchOne = async source => {
  // if `<source src="…" >`
  if (source.src) {
    // get data from remote endpoint
    const headers = new Headers({accept: 'application/json'});
    const response = await DataLoader.fetch(source.src, {headers});
    return {
      payload: await response.json(),
      headers: response.headers,
      srcElement: source,
      src: source.src,
    };
  } else { // if <script type="application/json">…</script>
    return {payload: JSON.parse(source.textContent)};
  }
};

class DataLoader extends HTMLElement {
  static get is () { return 'data-loader' }

  async fetch () {
    // get all the potentials sources elements
    const sources = getSourceData(...this.children);
    // if nothing there, bails
    if (!sources.length) return;

    let errors = [];
    let detail;
    // go over all the potential sources to try to load data from it
    for (const source of sources) {
      try {
        detail = await fetchOne(source);
        // if we're here, we have data, go out of the loop
        break;
      } catch (error) {
        errors.push(error);
      }
    }

    if (!detail) {
      this._errors = errors;
      this.dispatchEvent(
        new CustomEvent('error', {detail: errors, bubbles: true, cancelable: true})
      );
      return;
    }

    // apply selector to retrieved data
    if (typeof this.selector === 'string') {
      this._data = lodashGet(detail.payload, this.selector);
    } else {
      this._data = this.selector(detail.payload);
    }
    detail.payload = this.data;

    this.dispatchEvent(
      new CustomEvent('load', {detail, bubbles: true, cancelable: true})
    );
    return detail;
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

  // errors
  get errors () {
    return this._errors;
  }

  // loaded
  get selector () {
    return this._selector;
  }

  set selector (value) {
    this._selector = value;
  }

  // Custom element reactions
  constructor () {
    super();
    this._data = null;
    this.selector = (this.getAttribute('selector') || '').trim() || (d => d);
  }

  connectedCallback () {
    this.fetch();
  }
}

// Expose this in case user wants to use custom fetching logic
DataLoader.fetch = window.fetch.bind(window);

export default DataLoader;
