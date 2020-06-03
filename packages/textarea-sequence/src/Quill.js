import Quill from "quill/quill";
import "quill/dist/quill.core.css";

let previousText = "";
const format = (quill, force = false) => {
  const text = quill.getText().trim();
  if (!force && previousText.trim() === text.trim()) return;
  previousText = text;
  quill.removeFormat(0, text.length);
  let pos = 0;
  text.split("\n").forEach(line => {
    if (line.startsWith(">")) {
      quill.formatText(pos, line.length, "bold", true);
    } else {
      let linePos = 0;
      const parts = line.split(
        new RegExp(`([^${quill.alphabet}])`, quill["case-sensitive"] ? "" : "i")
      );
      parts.forEach((part, i) => {
        if (i % 2 === 1)
          quill.formatText(pos + linePos, part.length, {
            color: "rgb(255, 0, 0)",
            bold: true
          });
        linePos += part.length;
      });
    }
    pos += line.length + 1; // +1 or the new line
  });
};
export default (selector, alphabet, checkCase, single) => {
  Quill.register("modules/formatter", quill => {
    quill.on("text-change", () => format(quill));
  });

  // Quill.register('modules/clipboard', PlainClipboard, true);

  const quill = new Quill(selector, {
    // debug: 'info',
    formats: ["bold", "italic", "color"],
    placeholder: "Enter your sequence",
    modules: {
      formatter: true
    }
  });
  quill.alphabet = alphabet;
  quill["case-sensitive"] = checkCase;
  quill.single = single;
  quill.format = () => format(quill, true);
  return quill;
};
