import { LitElement, html } from "lit";

export type Constructor<T = {}> = new (...args: any[]) => T;

class NightingaleElement extends LitElement {
  render() {
    return html` <p>NightingaleElement.</p> `;
  }
}

export default NightingaleElement;
