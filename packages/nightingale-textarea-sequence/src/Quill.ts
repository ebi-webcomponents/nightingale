/* eslint-disable no-param-reassign */
import * as Q from "quill";
import "quill/dist/quill.core.css";
import debounce from "lodash-es/debounce";
import { cleanUpText, alphabets } from "./defaults";

const Quill = Q as unknown as typeof Q.Quill;

export type ExtendedQuill = Q.Quill & {
  container?: HTMLElement;
  minSequenceLength?: number;
  disableHeaderCheck?: boolean;
  allowComments?: boolean;
  caseSensitive?: boolean;
  valid?: boolean;
  single?: boolean;
  alphabet?: string;
  errors?: ErrorsObject;
  formatSequence?: FormatSequenceFunction;
  cleanUp?: () => void;
  customFormat?: () => void;
};

type ErrorsObject = {
  multipleSequences: boolean;
  hasInvalidCharacters: boolean;
  missingFirstHeader: boolean;
  tooShort: boolean;
  headerCheckRequiredForMultipleSequences: boolean;
};

export type FormatSequenceFunction = (
  sequence: string,
  options?: Record<string, unknown>
) => string;

const isTooShortAndFormat = (
  quill: ExtendedQuill,
  seqLength: number | null,
  pos: number
) => {
  if (seqLength !== null && seqLength < (quill.minSequenceLength || 0)) {
    quill.formatText(pos - seqLength - 1, seqLength, {
      background: "rgb(255, 255, 0)",
    });
    return true;
  }
  return false;
};

const anyErrors = (list: boolean[]): boolean =>
  list.reduce((agg, v) => agg || v, false);

const paintTextareaBorder = (quill: ExtendedQuill) => {
  if (!quill.container) return;
  if (quill.getText().trim() === "") {
    quill.container.style.border = "1px solid #ccc";
  } else {
    quill.container.style.border = `1px solid ${quill.valid ? "green" : "red"}`;
  }
};

let previousText = "";
const format = (quill: ExtendedQuill, force = false) => {
  const text = quill.getText().trim();
  if (!force && previousText.trim() === text.trim()) return;
  previousText = text;
  quill.removeFormat(0, text.length);
  let pos = 0;
  let numberOfHeaders = 0;
  let hasInvalidCharacters = false;
  let seqLength = 0;
  let tooShort = false;
  const missingFirstHeader =
    !quill.disableHeaderCheck && !text.trim().startsWith(">");
  let secondHeaderPosition = null;
  text.split("\n").forEach((line) => {
    if (line.startsWith(">")) {
      quill.formatText(pos, line.length, "bold", true);
      if (pos !== 0 && isTooShortAndFormat(quill, seqLength, pos))
        tooShort = true;
      seqLength = 0;
      numberOfHeaders++;
      if (
        (missingFirstHeader && numberOfHeaders === 1) ||
        numberOfHeaders === 2
      ) {
        secondHeaderPosition = pos;
      }
    } else if (quill.allowComments && line.startsWith(";")) {
      quill.formatText(pos, line.length, "color", "rgb(173, 198, 255)");
    } else {
      seqLength += line.replace(/\s/g, "").length;
      let linePos = 0;
      const parts = line.split(
        new RegExp(`([^${quill.alphabet}])`, quill.caseSensitive ? "" : "i")
      );
      parts.forEach((part, i) => {
        if (i % 2 === 1) {
          quill.formatText(pos + linePos, part.length, {
            color: "rgb(255, 0, 0)",
            background: "rgba(255, 0, 0, 0.5)",
            bold: true,
          });
          hasInvalidCharacters = true;
        }
        linePos += part.length;
      });
    }
    pos += line.length + 1; // +1 or the new line
  });
  if (isTooShortAndFormat(quill, seqLength, pos)) tooShort = true;
  const errors: ErrorsObject = {
    multipleSequences: numberOfHeaders > 1,
    hasInvalidCharacters,
    missingFirstHeader,
    tooShort,
    headerCheckRequiredForMultipleSequences:
      !!quill.disableHeaderCheck && !quill.single,
  };
  if (quill.single && errors.multipleSequences && secondHeaderPosition) {
    quill.formatText(secondHeaderPosition, text.length - secondHeaderPosition, {
      background: "rgba(255, 0, 0, 0.5)",
    });
  }
  if (JSON.stringify(errors) !== JSON.stringify(quill.errors)) {
    quill.errors = errors;
    quill.valid = !anyErrors(Object.values(errors));
    paintTextareaBorder(quill);
    quill.container?.dispatchEvent(
      new CustomEvent("error-change", { bubbles: true, detail: { errors } })
    );
  }
};

export default (
  selector: string,
  alphabet: string,
  checkCase: boolean,
  single: boolean,
  minLength: number,
  allowComments: boolean,
  formatSequence: FormatSequenceFunction,
  disableHeaderCheck: boolean
) => {
  Quill.register("modules/formatter", (quill: ExtendedQuill) => {
    quill.on(
      "text-change",
      debounce(() => format(quill), 200)
    );
  });

  const quill: ExtendedQuill = new Quill(selector, {
    // debug: 'info',
    formats: ["bold", "italic", "color", "background"],
    placeholder: "Enter your sequence",
    modules: {
      formatter: true,
    },
  });

  quill.errors = {
    multipleSequences: false,
    hasInvalidCharacters: false,
    missingFirstHeader: false,
    tooShort: false,
    headerCheckRequiredForMultipleSequences: false,
  };
  quill.alphabet = alphabets[alphabet as "dna" | "protein"] || alphabet;
  quill.caseSensitive = checkCase;
  quill.allowComments = allowComments;
  quill.minSequenceLength = minLength;
  quill.disableHeaderCheck = disableHeaderCheck;
  quill.single = single;
  quill.formatSequence = formatSequence;
  quill.customFormat = () => format(quill, true);
  quill.cleanUp = () => {
    const newText = cleanUpText(
      quill.getText(),
      quill.alphabet,
      quill.caseSensitive,
      !quill.allowComments,
      quill.single,
      quill.disableHeaderCheck,
      quill.formatSequence
    );
    quill.setText(newText);
    quill.customFormat?.();
  };
  return quill;
};
