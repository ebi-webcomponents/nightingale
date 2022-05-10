import { LitElement } from "lit";

export type Constructor<T = unknown> = new (...args: any[]) => T;

class NightingaleElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}

export default NightingaleElement;
