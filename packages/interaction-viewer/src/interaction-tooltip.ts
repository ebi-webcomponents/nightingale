import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import ProtvistaTooltip from "protvista-tooltip";

@customElement("interaction-tooltip")
class InteractionTooltip extends LitElement {
  @property()
  content: TemplateResult;

  @property()
  x: number;

  @property()
  y: number;

  @property()
  visible = false;

  constructor() {
    super();
    if (!window.customElements.get("protvista-tooltip")) {
      window.customElements.define("protvista-tooltip", ProtvistaTooltip);
    }
  }

  render(): TemplateResult {
    console.log(this.visible);
    return html`<protvista-tooltip
      title="My tooltip"
      x=${this.x}
      y=${this.y}
      ?visible=${this.visible}
    >
      ${this.content}
    </protvista-tooltip>`;
  }
}

export default InteractionTooltip;
