import * as Q from "quill";
import "quill/dist/quill.core.css";
import debounce from "lodash-es/debounce";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";

import NightingaleElement, {
  withDimensions,
} from "@nightingale-elements/nightingale-new-core";
import { cleanUpText, alphabets, formatSequence } from "./defaults";

type AvailableAlphabets = "dna" | "protein";

type ErrorsObject = {
  multipleSequences: boolean;
  hasInvalidCharacters: boolean;
  missingFirstHeader: boolean;
  tooShort: boolean;
  headerCheckRequiredForMultipleSequences: boolean;
};
type FormatSequenceFunction = (
  sequence: string,
  options?: Record<string, unknown>,
) => string;

const Quill = Q as unknown as typeof Q.Quill;

const SHORT_DEBOUNCE_TIME = 50;
const DEBOUNCE_TIME = 200;
@customElement("nightingale-textarea-sequence")
class TextareaSequence extends withDimensions(NightingaleElement) {
  quill: Q.Quill | null = null;

  @property({ type: String })
  override id = "";
  @property({ type: String })
  name = "sequence";

  #alphabet: string = alphabets.protein;
  @property({ type: String })
  get alphabet(): string {
    return this.#alphabet;
  }
  set alphabet(alphabet: string) {
    this.#alphabet =
      alphabet in alphabets
        ? alphabets[alphabet as AvailableAlphabets]
        : alphabet;
  }
  @property({ type: Number, attribute: "min-sequence-length" })
  minSequenceLength = 1;
  @property({ type: Boolean, attribute: "case-sensitive" })
  caseSensitive = false;
  @property({ type: Boolean, attribute: "allow-comments" })
  allowComments = false;
  @property({ type: Boolean, attribute: "disable-header-check" })
  disableHeaderCheck = false;
  @property({ type: Boolean })
  single = false;

  @property({ type: String, attribute: "valid-border-color" })
  validBorderColor = "green";
  @property({ type: String, attribute: "error-border-color" })
  errorBorderColor = "red";
  @property({ type: String, attribute: "comments-color" })
  commentsColor = "rgb(173, 198, 255)";
  @property({ type: String, attribute: "base-error-color" })
  baseErrorColor = "rgb(255, 0, 0)";
  @property({ type: String, attribute: "base-error-background-color" })
  baseErrorBackgroundColor = "rgba(255, 0, 0, 0.5)";
  @property({ type: String, attribute: "second-header-error-background-color" })
  secondHeaderErrorBackgroundColor = "rgba(255, 0, 0, 0.5)";
  @property({ type: String, attribute: "too-short-error-background-color" })
  tooShortErrorBackgroundColor = "rgb(255, 255, 0)";
  @property({ type: String, attribute: "inner-style" })
  innerStyle?: string;

  #container: Ref<HTMLDivElement> = createRef();
  #errors: ErrorsObject = {
    multipleSequences: false,
    hasInvalidCharacters: false,
    missingFirstHeader: false,
    tooShort: false,
    headerCheckRequiredForMultipleSequences: false,
  };
  #valid = true;
  #formatSequence: FormatSequenceFunction = formatSequence;

  override attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, _old, value);
    debounce(() => this.format(), SHORT_DEBOUNCE_TIME);
  }

  @property()
  set formatSequence(newFormatSequence: FormatSequenceFunction) {
    if (typeof newFormatSequence !== "function") {
      throw new Error("Only functions are supported for this parameter");
    } else if (this.quill) {
      this.#formatSequence = newFormatSequence;
      this.format();
    }
  }

  get sequence() {
    return this.quill?.getText();
  }

  get errors() {
    return this.#errors;
  }

  cleanUp() {
    if (!this.quill) return;
    const newText = cleanUpText(
      this.quill.getText(),
      this.alphabet,
      this.caseSensitive,
      !this.allowComments,
      this.single,
      this.disableHeaderCheck,
      this.#formatSequence,
    );
    this.quill.setText(newText);
    debounce(() => this.format(), SHORT_DEBOUNCE_TIME);
  }

  override render() {
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
      <style>
        ${inlineCSS}
      </style>
      <div
        ${ref(this.#container)}
        id="${this.id}-sequence-editor"
        class="sequence-editor"
        style=${ifDefined(this.innerStyle)}
      ></div>
      <input type="hidden" name="${this.name}" />
    `;
  }
  override firstUpdated() {
    Quill.register("modules/formatter", (quill: Q.Quill) => {
      quill.on(
        "text-change",
        debounce(() => this.format(), DEBOUNCE_TIME),
      );
    });
    if (this.#container.value) {
      this.quill = new Quill(this.#container.value, {
        // debug: 'info',
        formats: ["bold", "italic", "color", "background"],
        placeholder: "Enter your sequence",
        modules: {
          formatter: true,
        },
      });

      this.quill.on("text-change", () => {
        const input = this.querySelector<HTMLInputElement>(
          `input[name=${this.name}]`,
        );
        if (input) input.value = this.sequence || "";
      });
    }
  }

  #previousText = "";
  format(force = false) {
    if (!this.quill) return;
    const text = this.quill.getText().trim();
    if (!force && this.#previousText.trim() === text.trim()) return;
    this.#previousText = text;
    this.quill.removeFormat(0, text.length);
    let pos = 0;
    let numberOfHeaders = 0;
    let hasInvalidCharacters = false;
    let seqLength = 0;
    let tooShort = false;
    const missingFirstHeader =
      !this.disableHeaderCheck && !text.trim().startsWith(">");
    let secondHeaderPosition = null;
    text.split("\n").forEach((line) => {
      if (!this.quill) return;
      if (line.startsWith(">")) {
        this.quill.formatText(pos, line.length, "bold", true);
        if (pos !== 0 && this.isTooShortAndFormat(seqLength, pos))
          tooShort = true;
        seqLength = 0;
        numberOfHeaders++;
        if (
          (missingFirstHeader && numberOfHeaders === 1) ||
          numberOfHeaders === 2
        ) {
          secondHeaderPosition = pos;
        }
      } else if (this.allowComments && line.startsWith(";")) {
        this.quill.formatText(pos, line.length, "color", this.commentsColor);
      } else {
        seqLength += line.replace(/\s/g, "").length;
        let linePos = 0;
        const parts = line.split(
          new RegExp(`([^${this.alphabet}])`, this.caseSensitive ? "" : "i"),
        );
        parts.forEach((part, i) => {
          if (!this.quill) return;
          if (i % 2 === 1) {
            this.quill.formatText(pos + linePos, part.length, {
              color: this.baseErrorColor,
              background: this.baseErrorBackgroundColor,
              bold: true,
            });
            hasInvalidCharacters = true;
          }
          linePos += part.length;
        });
      }
      pos += line.length + 1; // +1 or the new line
    });
    if (this.isTooShortAndFormat(seqLength, pos)) tooShort = true;
    const errors = {
      multipleSequences: numberOfHeaders > 1,
      hasInvalidCharacters,
      missingFirstHeader,
      tooShort,
      headerCheckRequiredForMultipleSequences:
        !!this.disableHeaderCheck && !this.single,
    };
    if (this.single && errors.multipleSequences && secondHeaderPosition) {
      this.quill.formatText(
        secondHeaderPosition,
        text.length - secondHeaderPosition,
        {
          background: this.secondHeaderErrorBackgroundColor,
        },
      );
    }
    if (JSON.stringify(this.#errors) !== JSON.stringify(errors)) {
      this.#errors = errors;
      this.#valid = !anyErrors(Object.values(errors));
      this.paintTextareaBorder();
      this.#container?.value?.dispatchEvent(
        new CustomEvent("error-change", { bubbles: true, detail: { errors } }),
      );
    }
  }
  isTooShortAndFormat(seqLength: number | null, pos: number) {
    if (
      this.quill &&
      seqLength !== null &&
      seqLength < (this.minSequenceLength || 0)
    ) {
      this.quill.formatText(pos - seqLength - 1, seqLength, {
        background: this.tooShortErrorBackgroundColor,
      });
      return true;
    }
    return false;
  }
  paintTextareaBorder() {
    if (!this.#container?.value) return;
    if (this.quill?.getText().trim() === "") {
      this.#container.value.style.border = "1px solid #ccc";
    } else {
      this.#container.value.style.border = `1px solid ${
        this.#valid ? this.validBorderColor : this.errorBorderColor
      }`;
    }
  }
}

export default TextareaSequence;

const anyErrors = (list: boolean[]): boolean =>
  list.reduce((agg, v) => agg || v, false);
