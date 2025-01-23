import { LitElement } from "lit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;

class NightingaleElement extends LitElement {
  override connectedCallback() {
    super.connectedCallback();
    this.style.display = "inline-block";
    this.style.lineHeight = "0";
  }
  override createRenderRoot() {
    return this;
  }
}

export default NightingaleElement;
