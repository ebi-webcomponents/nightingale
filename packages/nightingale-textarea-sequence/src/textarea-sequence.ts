import Quill, { ExtendedQuill, FormatSequenceFunction } from "./Quill";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { alphabets, formatSequence } from "./defaults";
import NightingaleElement, {
  withDimensions,
} from "@nightingale-elements/nightingale-new-core";

type AvailableAlphabets = "dna" | "protein";

@customElement("nightingale-textarea-sequence")
class TextareaSequence extends withDimensions(NightingaleElement) {
  quill: ExtendedQuill | null = null;

  @property({ type: String })
  id = "";
  @property({ type: String })
  name = "sequence";

  #alphabet: string = alphabets.protein;
  @property({ type: String })
  get alphabet(): string {
    return this.#alphabet;
  }
  set alphabet(alphabet: string) {
    this.#alphabet = alphabet;
    this.reflectInQuill(
      "alphabet",
      alphabet in alphabets
        ? alphabets[alphabet as AvailableAlphabets]
        : alphabet
    );
  }
  #minSequenceLength = 1;
  @property({ type: Number, attribute: "min-sequence-length" })
  get minSequenceLength() {
    return this.#minSequenceLength;
  }
  set minSequenceLength(value: number) {
    this.#minSequenceLength = value;
    this.reflectInQuill("minSequenceLength", value);
  }
  #caseSensitive = false;
  @property({ type: Boolean, attribute: "case-sensitive" })
  get caseSensitive() {
    return this.#caseSensitive;
  }
  set caseSensitive(value: boolean) {
    this.#caseSensitive = value;
    this.reflectInQuill("caseSensitive", value);
  }
  #allowComments = false;
  @property({ type: Boolean, attribute: "allow-comments" })
  get allowComments() {
    return this.#allowComments;
  }
  set allowComments(value: boolean) {
    this.#allowComments = value;
    this.reflectInQuill("allowComments", value);
  }
  #disableHeaderCheck = false;
  @property({ type: Boolean, attribute: "disable-header-check" })
  get disableHeaderCheck() {
    return this.#disableHeaderCheck;
  }
  set disableHeaderCheck(value: boolean) {
    this.#disableHeaderCheck = value;
    this.reflectInQuill("disableHeaderCheck", value);
  }
  #single = false;
  @property({ type: Boolean })
  get single() {
    return this.#single;
  }
  set single(value: boolean) {
    this.#single = value;
    this.reflectInQuill("single", value);
  }

  @property({ type: String, attribute: "inner-style" })
  innerStyle?: string;

  reflectInQuill(name: keyof ExtendedQuill, value: unknown) {
    if (this.quill) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.quill as any)[name] = value;
      this.quill.customFormat?.();
    }
  }

  @property()
  set formatSequence(newFormatSequence: FormatSequenceFunction) {
    if (typeof newFormatSequence !== "function") {
      throw new Error("Only functions are supported for this parameter");
    } else if (this.quill) {
      this.quill.formatSequence = newFormatSequence;
      this.quill.customFormat?.();
    }
  }

  get sequence() {
    return this.quill?.getText();
  }

  get errors() {
    return this.quill?.errors;
  }

  cleanUp() {
    this.quill?.cleanUp?.();
  }

  render() {
    const inlineCSS = `
      .sequence-editor {
        border: 1px solid #ccc;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.8em;
        letter-spacing: .1rem;
        height: ${this.height ? `${this.height}px` : "auto"};
        width: ${this.width ? `${this.width}px` : "auto"};
        margin: 0 auto;
      }
    `;
    return html`
      <style>${inlineCSS}</style>
      <div 
        id="${this.id}-sequence-editor"
        class="sequence-editor"
        style=${ifDefined(this.innerStyle)}
      ></div>
      <input type="hidden" name="${this.name}"></input>
    `;
  }
  firstUpdated() {
    this.quill = Quill(
      `#${this.getAttribute("id") || ""}-sequence-editor`,
      this.alphabet,
      this.caseSensitive,
      this.single,
      this.minSequenceLength,
      this.allowComments,
      formatSequence,
      this.disableHeaderCheck
    );
    this.quill.on("text-change", () => {
      const input = this.querySelector<HTMLInputElement>(
        `input[name=${this.name}]`
      );
      if (input) input.value = this.sequence || "";
    });
  }
}

export default TextareaSequence;
