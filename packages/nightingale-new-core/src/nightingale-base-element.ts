import { LitElement, html } from "lit";

export type Constructor<T = {}> = new (...args: any[]) => T;

class NightingaleElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}

export default NightingaleElement;
