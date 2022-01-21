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
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(e: MouseEvent): void {
    const tagNames = e
      .composedPath()
      .map((eventTarget) => (eventTarget as HTMLElement).tagName);
    if (
      !tagNames.includes("circle") &&
      !tagNames.includes("PROTVISTA-TOOLTIP")
    ) {
      this.visible = false;
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.handleClickOutside);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleClickOutside);
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
