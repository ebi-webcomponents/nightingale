/* eslint-disable max-classes-per-file */
import lodashGet from "lodash-es/get";

// TODO: move that at a common place in the nightingale repo to be reused
// Watch out for the generated file structure when that is moved up in the repo
export abstract class NightingaleElement {
  static readonly is: string;
}

type Selector = string | ((data: any) => any);
type Data = { payload: any; headers: Headers };
type LoadEventData = {
  payload: any;
  headers?: Headers;
  srcElement?: HTMLSourceElement;
  src?: string;
};

const store: Map<string, Promise<Data>> = new Map();

export const load = (
  url: string,
  headers: Headers = new Headers({ accept: "application/json" })
) => {
  const cached = store.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const response = await window.fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `Request Failed: Status = ${
          response.status
        }; URI = ${url}; Time = ${new Date()}`
      );
    }
    if (response.status === 204) {
      // no data
      return { payload: null, headers: response.headers };
    }
    const payload = await response.json();
    return { payload, headers: response.headers };
  })();

  store.set(url, promise);

  promise.catch(() => store.delete(url));

  return promise;
};

const getSourceData = (children: HTMLCollection) =>
  Array.from(children).filter(child =>
    child.matches('source[src], script[type="application/json"]')
  );

class DataLoader extends HTMLElement implements NightingaleElement {
  private _errors: Error[];

  private _data: any;

  private _selector: Selector;

  static get is() {
    return "data-loader";
  }

  async fetch() {
    // get all the potentials sources elements
    const sources = getSourceData(this.children);
    // if nothing there, bails
    if (!sources.length) return;

    const errors = [];
    let detail: LoadEventData;

    // go over all the potential sources to try to load data from it
    /* eslint-disable no-restricted-syntax */
    for (const source of sources) {
      try {
        if (source instanceof HTMLSourceElement) {
          detail = {
            /* eslint-disable no-await-in-loop */
            ...(await load(source.src)),
            srcElement: source,
            src: (source as HTMLSourceElement).src
          };
        } else {
          detail = {
            payload: JSON.parse(source.textContent)
          };
        }

        // if we're here, we have data, go out of the loop
        break;
      } catch (error) {
        errors.push(error);
      }
    }

    if (!detail) {
      this._errors = errors;
      try {
        this.dispatchEvent(
          new CustomEvent("error", {
            detail: errors,
            bubbles: true,
            cancelable: true
          })
        );
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // apply selector to retrieved data
    if (typeof this.selector === "string") {
      this._data = lodashGet(detail.payload, this.selector);
    } else {
      this._data = this.selector(detail.payload);
    }
    detail.payload = this.data;

    this.dispatchEvent(
      new CustomEvent("load", { detail, bubbles: true, cancelable: true })
    );
  }

  // Getters/Setters
  // data
  get data(): any {
    return this._data;
  }

  // loaded
  get loaded(): boolean {
    return !!this.data;
  }

  // errors
  get errors(): Error[] {
    return this._errors;
  }

  // loaded
  get selector(): Selector {
    return this._selector;
  }

  set selector(value: Selector) {
    this._selector = value;
  }

  // Custom element reactions
  constructor() {
    super();
    this._data = null;
    this.selector =
      (this.getAttribute("selector") || "").trim() || ((d: any) => d);
  }

  connectedCallback() {
    this.fetch();
  }
}

export default DataLoader;
