import Quill from "./Quill";
import { alphabets, formatSequence } from "./defaults";

class TextareaSequence extends HTMLElement {
  constructor() {
    super();
    this.quill = null;
    this.alphabet = alphabets.protein;
    this["min-sequence-length"] = 1;
    this["case-sensitive"] = false;
    this["allow-comments"] = false;
    this.single = false;
  }

  connectedCallback() {
    this.firstRender();
  }

  static get observedAttributes() {
    return [
      "alphabet",
      "case-sensitive",
      "single",
      "width",
      "height",
      "min-sequence-length",
      "allow-comments",
      "inner-style",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const flags = ["single", "case-sensitive", "allow-comments"];
    const innerDiv = this._getInnerDiv();
    if (!innerDiv || !this.quill) {
      requestAnimationFrame(() =>
        this.attributeChangedCallback(name, oldValue, newValue)
      );
      return;
    }
    if (oldValue !== newValue) {
      if (name === "width" || name === "height") {
        const value = this.getAttribute(name);
        if (innerDiv && value !== null && value.trim() !== "") {
          innerDiv.style[name] = value;
        }
      } else if (name === "inner-style") {
        const w = innerDiv.style.width;
        const h = innerDiv.style.height;
        innerDiv.setAttribute("style", newValue);
        innerDiv.style.width = innerDiv.style.width || w;
        innerDiv.style.height = innerDiv.style.height || h;
      } else if (this.quill) {
        if (name === "alphabet" && newValue in alphabets) {
          this.quill[name] = alphabets[newValue];
        } else if (flags.indexOf(name) !== -1) {
          this.quill[name] = newValue === "true";
        } else if (name === "min-sequence-length") {
          this.quill[name] = parseInt(newValue, 10);
        } else {
          this.quill[name] = newValue;
        }
        this.quill.format();
      }
    }
  }

  /**
   * @param {function} newFormatSequence
   */
  set formatSequence(newFormatSequence) {
    if (typeof newFormatSequence !== "function") {
      throw new Error("Only functions are supported for this parameter");
    } else if (this.quill) {
      this.quill.formatSequence = newFormatSequence;
    }
  }

  get sequence() {
    return this.quill.getText();
  }

  get errors() {
    return this.quill.errors;
  }

  _getInnerDiv() {
    const innerDiv = this.getElementsByClassName("sequence-editor");
    if (innerDiv && innerDiv.length) {
      return innerDiv[0];
    }
    return null;
  }

  cleanUp() {
    this.quill.cleanUp();
  }

  firstRender() {
    const inlineCSS = `
      .sequence-editor {
        border: 1px solid #ccc;
        font-family: 'Courier New', Courier, monospace; font-size: 1em;
        letter-spacing: .1rem;
        height: auto;
        margin: 0 auto;
        width: auto;        
      }
    `;
    const name = this.getAttribute("name") || "sequence";
    this.innerHTML = `
    <style>${inlineCSS}{</style>
    <div 
      id="${this.getAttribute("id") || ""}sequence-editor"
      class="sequence-editor"
    ></div>
    <input type="hidden" name="${name}"></input>
    `;

    this.quill = new Quill(
      `#${this.getAttribute("id") || ""}sequence-editor`,
      this.alphabet,
      this["case-sensitive"],
      this.single,
      this["min-sequence-length"],
      this["allow-comments"],
      formatSequence
    );
    this.quill.on("text-change", () => {
      this.querySelector(`input[name=${name}]`).value = this.sequence;
    });
  }
}

export default TextareaSequence;
