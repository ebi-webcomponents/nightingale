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
    this.single = true;
  }

  connectedCallback() {
    this.firstRender();
  }

  static get observedAttributes() {
    return ["alphabet", "case-sensitive", "single", "width", "height"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "width" || name === "height") {
        const innerDiv = this._getInnerDiv();
        const value = this.getAttribute(name);
        if (value !== null && value.trim() !== "") {
          innerDiv.style[name] = value;
        }
        return;
      }
      if (this.quill) {
        if (name === "alphabet" && newValue in alphabets) {
          this.quill[name] = alphabets[newValue];
        } else if (name === "single" || name === "case-sensitive") {
          this.quill[name] = newValue === "true";
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
    console.error("Can't find the inner div");
    return null;
  }

  firstRender() {
    const inlineCSS = `
      .sequence-editor {
        border: 1px solid #ccc;
        font-family: 'Courier New', Courier, monospace; font-size: 1em;
        letter-spacing: .2rem;
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
      this.single
    );
  }

  refresh() {
    console.log("refresh?", this);
  }
}

export default TextareaSequence;
