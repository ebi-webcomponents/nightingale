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
  preview?: boolean = false;

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
        "The 'element-id' attribute is not related with a current DOM element",
      );
    }
    element.style.display = "block"; // In order to get the width and height of protvista manager, its display has to be set to block

    // PreSave function allows to do anything before actually printing on the canvas
    if (typeof this.preSave === "function") {
      this.preSave();
    }
    element.querySelector("canvas.preview")?.remove();
    const { width, height } = element.getBoundingClientRect();

    const scaleFactor = this.scaleFactor || 1;
    const scaledWidth = scaleFactor * (width + (this.extraWidth as number));
    const scaledHeight = scaleFactor * (height + (this.extraHeight as number));
    const canvas = document.createElement("canvas");
    canvas.className = "preview";
    canvas.setAttribute("width", `${scaledWidth}px`);
    canvas.setAttribute("height", `${scaledHeight}px`);
    if (this.fillColor) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = this.fillColor;
        context.fillRect(0, 0, scaledWidth, scaledHeight);
      }
    }
    if (this.preview) {
      element.appendChild(canvas);
    }

    // Rendering the Protvista svg
    rasterizeHTML
      .drawHTML(wrapHTML(element.outerHTML), canvas, {
        zoom: scaleFactor,
      })
      .then(() => {
        copyCanvases(element, canvas, scaleFactor);
        const image = canvas
          .toDataURL(`image/${this.fileFormat}`, 1.0)
          .replace(`image/${this.fileFormat}`, "image/octet-stream");
        if (!this.preview) {
          const link = document.createElement("a");
          link.download = `${this.fileName}.${this.fileFormat}`;
          link.href = image;
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch((err) => {
        console.error(err);
        throw new Error(
          `Couldn't generate the snapshot for the element '${this.elementId}'`,
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

  override render() {
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


/** Render contents of all HTML canvas elements within `srcElement` into `destCanvas`. */
function copyCanvases(srcElement: HTMLElement, destCanvas: HTMLCanvasElement, destScale: number = 1) {
  const destCtx = destCanvas.getContext("2d");
  if (!destCtx) {
    console.error("Failed to write to destination canvas.");
    return;
  }

  const parentBox = srcElement.getBoundingClientRect();
  const srcCanvases = srcElement.querySelectorAll('canvas');
  for (const srcCanvas of srcCanvases) {
    if (srcCanvas === destCanvas) continue;
    const box = srcCanvas.getBoundingClientRect();
    const destX = destScale * (box.x - parentBox.x);
    const destY = destScale * (box.y - parentBox.y);
    const destWidth = destScale * box.width;
    const destHeight = destScale * box.height;
    // Try render high-resolution image, if `srcCanvas` belongs to an element supporting `getImageData` (e.g. `NightingaleTrackCanvas`):
    type GetImageDataFunc = (options?: { scale?: number }) => ImageData | undefined;
    const nightingaleElement = findAncestor(srcCanvas, elem => 'getImageData' in elem && typeof elem.getImageData === 'function') as { getImageData: GetImageDataFunc } | undefined;
    const image = nightingaleElement?.getImageData({ scale: destScale });
    if (image) {
      // Copy rendered image with required resolution
      const offscreen = new OffscreenCanvas(image.width, image.height);
      offscreen.getContext('2d')?.putImageData(image, 0, 0);
      destCtx.drawImage(offscreen,
        0, 0, offscreen.width, offscreen.height,
        destX, destY, destWidth, destHeight,
      );
    } else {
      // Copy canvas content as is (will be blurred if destination size is larger)
      destCtx.drawImage(srcCanvas,
        0, 0, srcCanvas.width, srcCanvas.height,
        destX, destY, destWidth, destHeight,
      );
    }
  }
}

/** Return nearest DOM ancestor which fulfills `predicate`, if any. */
function findAncestor(element: HTMLElement | null, predicate: (elem: HTMLElement) => Boolean): HTMLElement | undefined {
  while (element) {
    if (predicate(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return undefined;
}
