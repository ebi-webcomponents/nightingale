import lodashGet from "lodash-es/get";
import RequestManager from "./request-manager";

const getSourceData = (...children: Element[]) =>
  children.filter(child =>
    child.matches('source[src], script[type="application/json"]')
  );

type Selector = string | ((data: any) => any);

class DataLoader extends HTMLElement {
  private _errors: Error[];
  private _data: any;
  private _selector: Selector;

  static get is() {
    return "data-loader";
  }

  async fetch() {
    // get all the potentials sources elements
    const sources = getSourceData(...this.children);
    // if nothing there, bails
    if (!sources.length) {
      return;
    }

    const errors = [];
    let detail;

    // go over all the potential sources to try to load data from it
    /* eslint-disable no-restricted-syntax */
    for (const source of sources) {
      try {
        /* eslint-disable no-await-in-loop */
        detail = await RequestManager.fetch(source);
        detail.srcElement = source;
        detail.src = (<HTMLSourceElement>source).src;

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
