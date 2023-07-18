import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as rasterizeHTML from "rasterizehtml";
import NightingaleElement from "@nightingale-elements/nightingale-new-core";

// Accepted file formats
export const formats = ["png", "jpeg", "bmp", "tiff", "gif"];

@customElement("nightingale-saver")
class NightingaleSaver extends NightingaleElement {
  @property({ type: String, attribute: "element-id" })
  elementId?: string = "";
  @property({ type: String, attribute: "background-color" })
  fillColor?: string = "transparent";
  @property({ type: String, attribute: "file-name" })
  fileName?: string = "nightingale.snapshot";
  @property({
    type: String,
    attribute: "file-format",
    converter: (value) => (formats.includes(value || "") ? value : "png"),
  })
  fileFormat?: string = "png";
  @property({ type: Number, attribute: "extra-width" })
  extraWidth?: number = 0;
  @property({ type: Number, attribute: "extra-height" })
  extraHeight?: number = 0;
  @property({ type: Number, attribute: "scale-factor" })
  scaleFactor?: number = 1;
  @property({ type: Boolean })
  debug?: boolean = false;

  preSave?: () => void = undefined;
  postSave?: () => void = undefined;

  constructor() {
    super();
    this.saveSvg = this.saveSvg.bind(this);
  }
  saveSvg() {
    const element = document.querySelector<HTMLElement>(`#${this.elementId}`);
    if (!element) {
      throw new Error(
        "The 'element-id' attribute is not related with a current DOM element"
      );
    }
    element.style.display = "block"; // In order to get the width and height of protvista manager, its display has to be set to block

    // PreSave function allows to do anything before actually printing on the canvas
    if (typeof this.preSave === "function") {
      this.preSave();
    }
    const { width, height } = element.getBoundingClientRect();
    const scaleFactor = this.scaleFactor || 1;
    const scaledWidth = scaleFactor * (width + (this.extraWidth as number));
    const scaledHeight = scaleFactor * (height + (this.extraHeight as number));
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", `${scaledWidth}px`);
    canvas.setAttribute("height", `${scaledHeight}px`);
    if (this.fillColor) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = this.fillColor;
        context.fillRect(0, 0, scaledWidth, scaledHeight);
      }
    }
    if (this.debug) element.appendChild(canvas);

    // Rendering the Protvista svg
    rasterizeHTML
      .drawHTML(wrapHTML(element.outerHTML), canvas, {
        zoom: scaleFactor,
      })
      .then(() => {
        const image = canvas
          .toDataURL(`image/${this.fileFormat}`, 1.0)
          .replace(`image/${this.fileFormat}`, "image/octet-stream");
        const link = document.createElement("a");
        link.download = `${this.fileName}.${this.fileFormat}`;
        link.href = image;
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.error(err);
        throw new Error(
          `Couldn't generate the snapshot for the element '${this.elementId}'`
        );
      })
      .finally(() => {
        element.style.display = ""; // Display property is set back to its original value
        // Reverting the changes to the dom if it had been changed during the preSave
        if (typeof this.postSave === "function") {
          this.postSave();
        }
      });
  }

  render() {
    /* The component only supports button as child and it has to be the first child element. If not, an error is thrown. By default,
        a save button is shown if nothing is specified. */
    let button;
    // const save = () => this.saveSvg();
    if (this.hasChildNodes()) {
      const child = this.firstElementChild;
      if (child?.tagName === "BUTTON") {
        child.addEventListener("click", this.saveSvg);
        button = html` ${child} `;
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
    return button;
  }
}

export default NightingaleSaver;

const wrapHTML = (html: string) =>
  `
<html>
  <head>
    <style>
      html, body {
        padding: 0;
        margin: 0;
      }
    </style>
  </head>
  <body>${html}</body>
</html>
`;
