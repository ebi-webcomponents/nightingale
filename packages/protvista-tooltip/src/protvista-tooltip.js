import { LitElement, html, css } from "lit-element";

// defaults
const TRIANGLE_WIDTH = 16;
const TRIANGLE_HEIGHT = 10;

/**
 * Utility function to extract pixel values from CSS extracted properties
 * @param {DOMString} string a string containing a property value
 * @param {number} defaultValue default value to provide if can't extract
 */
const getNumberFromStyleString = (string, defaultValue = 0) => {
  const match = (string || "").match(/(?<number>\d+\.?\d*)px/);
  if (!match) return defaultValue;
  return +match.groups.number;
};

class ProtvistaTooltip extends LitElement {
  static get properties() {
    return {
      // title to be displayed
      title: { type: String, reflect: true },
      // x position of the target in pixels
      x: { type: Number, reflect: true },
      // y position of the target in pixels
      y: { type: Number, reflect: true },
      // flag
      visible: { type: Boolean, reflect: true },
      // selector pointing to the container of the tooltip (for edge detection)
      container: { type: String, reflect: true }
    };
  }

  constructor() {
    super();

    // defaults
    this.title = "";
    this.x = 0;
    this.y = 0;
    this.visible = false;
    this.container = "html";

    // rerender on any change in the DOM subtree (change in tooltip content) to
    // make sure the position is still correct and orientation are still correct
    this._observer = new MutationObserver(() => this.requestUpdate());
  }

  connectedCallback() {
    super.connectedCallback();

    this._observer.observe(this, {
      subtree: true,
      characterData: true,
      childList: true
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._observer.disconnect();
  }

  static get styles() {
    return css`
      :host {
        --z-index: 50000;
        --title-color: black;
        --text-color: white;
        --body-color: #616161;
        --triangle-width: ${TRIANGLE_WIDTH}px;
        --triangle-height: ${TRIANGLE_HEIGHT}px;
        --border-radius: none;
      }

      .tooltip {
        font-family: Roboto, Arial, sans-serif;
        font-size: 0.9rem;
        top: 0;
        left: 0;
        display: block;
        position: absolute;
        min-width: 220px;
        max-width: 50vw;

        /* user overridable through custom properties */
        z-index: var(--z-index);
        color: var(--text-color);
        border-radius: var(--border-radius, 10px);

        /* will change those */
        opacity: 0;
        pointer-events: none;
        transform: translate(0, 0);
      }

      .tooltip.visible {
        opacity: 0.9;
        pointer-events: auto;
      }

      .tooltip::before {
        content: "";
        position: absolute;
        pointer-events: none;
        border-style: solid;
        border-color: transparent;
        border-width: 0 calc(var(--triangle-width) / 2);
      }

      .tooltip.arrow-left::before {
        left: 0;
      }

      .tooltip.arrow-right::before {
        right: 0;
      }

      .tooltip.arrow-up::before {
        top: calc(-1 * var(--triangle-height));
        border-bottom-color: var(--title-color);
        border-bottom-width: var(--triangle-height);
      }

      .tooltip.arrow-down::before {
        bottom: calc(-1 * var(--triangle-height));
        border-top-color: var(--body-color);
        border-top-width: var(--triangle-height);
      }

      h1 {
        margin: 0;
        background-color: var(--title-color);
        line-height: 2em;
        padding-left: 1ch;
      }

      :host a,
      :host a:link,
      :host a:active,
      :host a:hover {
        color: #fff;
      }

      .tooltip-body {
        padding: 1em;
        background: var(--body-color);
        font-weight: normal;
        overflow-y: auto;
        max-height: 40vh;
      }

      ::slotted(h4) {
        font-size: 1.2rem !important;
        margin: 0 0 0.5rem 0 !important;
        font-weight: 600 !important;
        color: #fff !important;
      }

      ::slotted(h5) {
        font-size: 1rem !important;
        margin: 0 !important;
        font-weight: 500 !important;
        color: #fff !important;
      }

      ::slotted(p) {
        margin: 0.25rem 0 1rem 0 !important;
      }

      ::slotted(ul) {
        list-style: none !important;
        margin: 0.25rem 0 1rem 0 !important;
        padding: 0 !important;
      }
    `;
  }

  _getPosition() {
    if (!this.shadowRoot.firstElementChild) return {};

    // retrieve all necessary measurements
    const container = document.querySelector(this.container || "html");
    const containerRect = container.getBoundingClientRect();
    const tooltipRect = this.shadowRoot.firstElementChild.getBoundingClientRect();
    const style = getComputedStyle(this);
    const triangleWidth = getNumberFromStyleString(
      style.getPropertyValue("--triangle-width"),
      TRIANGLE_WIDTH
    );
    const triangleHeight = getNumberFromStyleString(
      style.getPropertyValue("--triangle-height"),
      TRIANGLE_HEIGHT
    );

    // horizontal
    // default
    let x = this.x - triangleWidth / 2;
    let horizontal = "left";
    // does it fit?
    const fitsHorizontally = x + tooltipRect.width <= containerRect.right;
    if (!fitsHorizontally) {
      // alternative
      horizontal = "right";
      x = this.x - tooltipRect.width + triangleWidth / 2;
    }

    // horizontal
    // default
    let y = this.y + triangleHeight;
    let vertical = "up";
    // does it fit?
    const fitsVertically = y + tooltipRect.height <= containerRect.height;
    if (!fitsVertically) {
      // alternative
      vertical = "down";
      y = this.y - tooltipRect.height - triangleHeight;
    }

    return { x, y, horizontal, vertical };
  }

  firstUpdated() {
    // on the first render, the element were not in the DOM yet, so need to
    // rerender to get correct DOM size calculations
    this.requestUpdate();
  }

  render() {
    let visible = this.title && this.visible;
    // only compute that if tooltip is visible
    const position = visible ? this._getPosition() : {};
    // if no position calculated, shouldn't be visible yet
    visible = position.x && visible;
    // position on screen with css translate
    const style =
      visible &&
      `
      transform: translate(${position.x}px, ${position.y}px);
    `;

    return html`
        <section
          class="tooltip arrow-${position.horizontal ||
            "left"} arrow-${position.vertical || "up"} ${
      visible ? "visible" : ""
    }"
          style="${style}"
        >
          <h1>${this.title}</h1>
          <div class="tooltip-body"><slot></slot></div>
        </sectionclass="tooltip>
      `;
  }
}

export default ProtvistaTooltip;
