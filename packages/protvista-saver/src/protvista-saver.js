import * as rasterizeHTML from "rasterizehtml";
import { html, render } from "lit-html";

class ProtvistaSaver extends HTMLElement {
  connectedCallback() {
    this.elementId = this.getAttribute("element-id");
    this.fillColor = this.getAttribute("background-color");
    this.renderContent();
  }

  set backgroundColor(color) {
    // By default it is rendered as transparent. Set background() can be used to set the canvas background color
    this.fillColor = color;
  }

  saveSvg() {
    const _this = this.parentElement;
    const id = _this.elementId;
    // PreSave function allows to do anything before actually printing on the canvas
    if (typeof _this.preSave === "function") {
      _this.preSave();
    }
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", "900");
    canvas.setAttribute("height", "900");
    if (_this.fillColor) {
      const context = canvas.getContext("2d");
      context.fillStyle = _this.fillColor;
      context.fillRect(0, 0, 900, 900);
    }
    // Rendering the Protvista svg
    rasterizeHTML
      .drawHTML(document.getElementById(id).innerHTML, canvas)
      .then(function(result) {
        const image = canvas
          .toDataURL("image/png", 1.0)
          .replace("image/png", "image/octet-stream");
        const link = document.createElement("a");
        link.download = "my-image.png";
        link.href = image;
        link.click();
      })
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        // Reverting the changes to the dom if it had been changed during the preSave
        if (typeof _this.postSave === "function") {
          _this.postSave();
        }
      });
  }

  renderContent() {
    /* The component only supports button as child and it has to be the first child element. If not, an error is thrown. By default,
        a save button is shown if nothing is specified. */
    let button;
    if (this.hasChildNodes()) {
      const child = this.firstElementChild;
      if (child.tagName === "BUTTON") {
        child.addEventListener("click", this.saveSvg);
        button = html`
          ${child}
        `;
      } else {
        console.error("Only Buttons are accepted as children");
      }
    } else {
      button = html`
        <button
          style="background-color: #1878ba; color: white; cursor: pointer; display: inline-block;padding: 0.5rem 0.5rem; border-radius: 4px; margin-bottom: 5px;"
          @click=${this.saveSvg}
        >
          Download
        </button>
      `;
    }
    render(button, this);
  }
}

export default ProtvistaSaver;
