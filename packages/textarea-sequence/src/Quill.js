/* eslint-disable no-param-reassign */
import Quill from "quill/quill";
import "quill/dist/quill.core.css";
import debounce from "lodash-es/debounce";
import { cleanUpText } from "./defaults";

const isTooShortAndFormat = (quill, seqLength, pos) => {
  if (seqLength !== null && seqLength < quill["min-sequence-length"]) {
    quill.formatText(pos - seqLength - 1, seqLength, {
      background: "rgb(255, 255, 0)",
    });
    return true;
  }
  return false;
};

const any = (list) => list.reduce((agg, v) => agg || v, false);

const paintTextareaBorder = (quill) => {
  if (quill.getText().trim() === "") {
    quill.container.style.border = "1px solid #ccc";
  } else {
    quill.container.style.border = `1px solid ${quill.valid ? "green" : "red"}`;
  }
};

let previousText = "";
const format = (quill, force = false) => {
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
    !quill["disable-header-check"] && !text.trim().startsWith(">");
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
    } else if (quill["allow-comments"] && line.startsWith(";")) {
      quill.formatText(pos, line.length, "color", "rgb(173, 198, 255)");
    } else {
      seqLength += line.replace(/\s/g, "").length;
      let linePos = 0;
      const parts = line.split(
        new RegExp(`([^${quill.alphabet}])`, quill["case-sensitive"] ? "" : "i")
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
  const errors = {
    multipleSequences: numberOfHeaders > 1,
    hasInvalidCharacters,
    missingFirstHeader,
    tooShort,
    headerCheckRequiredForMultipleSequences:
      quill["disable-header-check"] && !quill.single,
  };
  if (quill.single && errors.multipleSequences && secondHeaderPosition) {
    quill.formatText(secondHeaderPosition, text.length - secondHeaderPosition, {
      background: "rgba(255, 0, 0, 0.5)",
    });
  }
  if (JSON.stringify(errors) !== JSON.stringify(quill.errors)) {
    quill.errors = errors;
    quill.valid = !any(Object.values(errors));
    paintTextareaBorder(quill);
    quill.container.dispatchEvent(
      new CustomEvent("error-change", { bubbles: true, detail: { errors } })
    );
  }
};

export default (
  selector,
  alphabet,
  checkCase,
  single,
  minLength,
  allowComments,
  formatSequence,
  disableHeaderCheck
) => {
  Quill.register("modules/formatter", (quill) => {
    quill.on(
      "text-change",
      debounce(() => format(quill), 200)
    );
  });

  const quill = new Quill(selector, {
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
  quill.alphabet = alphabet;
  quill["case-sensitive"] = checkCase;
  quill["allow-comments"] = allowComments;
  quill["min-sequence-length"] = minLength;
  quill["disable-header-check"] = disableHeaderCheck;
  quill.single = single;
  quill.formatSequence = formatSequence;
  quill.format = () => format(quill, true);
  quill.cleanUp = () => {
    const newText = cleanUpText(
      quill.getText(),
      quill.alphabet,
      quill["case-sensitive"],
      !quill["allow-comments"],
      quill.single,
      quill["disable-header-check"],
      quill.formatSequence
    );
    quill.setText(newText);
    quill.format();
  };
  return quill;
};
