import { html, render } from "lit-html";

class NightingaleZoomTool extends HTMLElement {
  static is = "nightingale-zoom-tool";

  connectedCallback() {
    if (this.closest("nightingale-manager")) {
      this.manager = this.closest("nightingale-manager");
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
    let zoomInButton = html`
      <button
        style="cursor: pointer; border-radius: 4px;"
        @click=${() => this.zoom("zoom-in")}
        id="zoom-in"
        title="Zoom In"
      >
        +
      </button>
    `;
    let zoomOutButton = html`
      <button
        style="cursor: pointer; border-radius: 4px;"
        @click=${() => this.zoom("zoom-out")}
        id="zoom-out"
        title="Zoom Out"
      >
        -
      </button>
    `;

    /* The buttons can be customised but they should contain the respective ids -
     * 'zoom-in' or 'zoom-out'. Otherwise the default buttons are shown
     * */
    if (this.hasChildNodes()) {
      const { children } = this;
      Array.from(children).forEach((child) => {
        if (child.tagName === "BUTTON") {
          child.addEventListener("click", () => this.zoom(child.id));
          if (child.id === "zoom-in") zoomInButton = html` ${child} `;
          else if (child.id === "zoom-out") zoomOutButton = html` ${child} `;
        }
      });
    }
    const content = html`
      <div class="zoom-button-div">${zoomInButton} ${zoomOutButton}</div>
    `;
    render(content, this);
  }
}

export default NightingaleZoomTool;
