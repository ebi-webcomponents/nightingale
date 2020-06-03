import Quill from "./Quill";

const alphabets = {
  dna: "AGTCN ",
  protein: "ACDEFGHIKLMNPQRSTVWY "
};
class TextareaSequence extends HTMLElement {
  constructor() {
    super();
    this.quill = null;
    this.alphabet = alphabets.protein;
    this["case-sensitive"] = false;
    this["min-sequence-length"] = 0;
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
      "min-sequence-length"
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
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
      } else if (this.quill) {
        if (name === "alphabet" && newValue in alphabets) {
          this.quill[name] = alphabets[newValue];
        } else if (name === "single" || name === "case-sensitive") {
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

  _getInnerDiv() {
    const innerDiv = this.getElementsByClassName("sequence-editor");
    if (innerDiv && innerDiv.length) {
      return innerDiv[0];
    }
    return null;
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
    this.innerHTML = `
    <style>${inlineCSS}{</style>
    <div 
      id="sequence-editor"
      class="sequence-editor"
    />`;
    this.quill = new Quill(
      "#sequence-editor",
      this.alphabet,
      this["case-sensitive"],
      this.single,
      this["min-sequence-length"]
    );
  }
}

export default TextareaSequence;
