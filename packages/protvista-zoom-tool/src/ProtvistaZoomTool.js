import { html, render } from "lit-html";

class ProtvistaZoomTool extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
    this._length = parseFloat(this.getAttribute("length"));
    this._displaystart = parseFloat(this.getAttribute("displaystart")) || 1;
    this._displayend =
      parseFloat(this.getAttribute("displayend")) || this._length;
    this._scaleFactor = parseFloat(this.getAttribute("scalefactor")) || 10;

    this.renderContent();
  }

  static get observedAttributes() {
    return ["length", "displaystart", "displayend"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[`_${name}`] = parseFloat(newValue);
    }
  }

  zoom(operation) {
    let k;
    if (operation === "zoom-in") k = this._scaleFactor;
    else k = -this._scaleFactor;
    const newStart =
      this._displaystart === 1
        ? this._displaystart - 1 + k
        : this._displaystart + k;
    const newEnd = this._displayend - k;
    if (newStart < newEnd) {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            displaystart: Math.max(1, newStart),
            displayend: Math.min(newEnd, this._length),
          },
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }

  renderContent() {
    const content = html`
      <style>
        button {
          display: inline-block;
          border: none;
          padding: var(--button-padding-v, 0.5rem) var(--button-padding-h, 1rem);
          margin: var(--button-margin-v, 0) var(--button-margin-h, 0);
          text-decoration: none;
          background: var(--button-background, #d3d3d3);
          color: var(--button-text-color);
          font-family: var(--font-family, sans-serif);
          font-size: var(--font-size, 1rem);
          cursor: pointer;
          text-align: center;
          transition: var(
            --button-transition,
            background 250ms ease-in-out,
            transform 150ms ease
          );
          -webkit-appearance: none;
          -moz-appearance: none;
        }

        button:hover,
        button:focus {
          background: var(--button-background-focus);
        }
      </style>
      <button @click=${() => this.zoom("zoom-out")} title="Zoom Out">
        <slot name="zoom-out">Zoom out</slot>
      </button>
      <button @click=${() => this.zoom("zoom-in")} title="Zoom In">
        <slot name="zoom-in">Zoom in</slot>
      </button>
    `;
    render(content, this.shadowRoot);
  }
}

export default ProtvistaZoomTool;
