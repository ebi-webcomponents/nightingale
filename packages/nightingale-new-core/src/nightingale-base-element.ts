import { LitElement } from "lit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;

class NightingaleElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}

export default NightingaleElement;
