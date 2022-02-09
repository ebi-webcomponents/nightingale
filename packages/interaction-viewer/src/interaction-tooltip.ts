import { html, css, LitElement, TemplateResult } from "lit";
// eslint-disable-next-line import/extensions
import { customElement, property } from "lit/decorators.js";
import ProtvistaTooltip from "protvista-tooltip";

@customElement("interaction-tooltip")
export default class InteractionTooltip extends LitElement {
  @property({ type: Object })
  content: TemplateResult;

  @property({ type: Number })
  x: number;

  @property({ type: Number })
  y: number;

  @property({ type: Boolean })
  visible = false;

  static styles = css`
    a,
    a:link,
    a:active,
    a:hover {
      color: #fff;
    }

    table {
      color: #fff;
    }
  `;

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
    return html`<protvista-tooltip
      title="Interaction"
      x=${this.x}
      y=${this.y}
      ?visible=${this.visible}
    >
      ${this.content}
    </protvista-tooltip>`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface HTMLElementTagNameMap {
    "interaction-tooltip": InteractionTooltip;
  }
}
