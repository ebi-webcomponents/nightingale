import { LitElement, html, PropertyValues } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import object2style from "../utils/object2style";

@customElement("msa-labels")
class Labels extends LitElement {
  @property()
  width = 0;
  @property()
  height = 0;
  @property()
  y = 0;
  @state()
  labels: string[] = [];
  @property({
    type: Number,
    attribute: "tile-height",
  })
  tileHeight = 20;

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("y")) {
      const ul = this.renderRoot.querySelector("ul");
      if (ul) ul.scrollTop = this.y;
    }
  }
  render() {
    const ulStyle = {
      width: `${this.width}px`,
      height: `${this.height}px`,
      "list-style": "none",
      padding: 0,
      margin: 0,
      "line-height": `${this.tileHeight}px`,
      color: "rgb(0, 99, 154)",
      "text-transform": "uppercase",
      overflow: "hidden",
      "font-weight": "normal",
      "font-size": "14px",
      cursor: "pointer",
    };
    return html`<ul style=${object2style(ulStyle)}>
      ${this.labels.map((label) => html`<li>${label}</li>`)}
    </ul>`;
  }
}

export default Labels;
