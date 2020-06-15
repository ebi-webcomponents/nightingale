import TextareaSequence from "./TextareaSequence";

if (window.customElements) {
  customElements.define("textarea-sequence", TextareaSequence);
}

export { cleanUpText } from "./defaults";
export { formatSequence } from "./defaults";
export default TextareaSequence;
