type SequenceObject = {
  header: string;
  sequence: string;
  comments: SequenceComments;
};
type SequenceComments = Record<string, string>;

export const alphabets = {
  dna: "AGTCN ",
  protein: "ACDEFGHIKLMNPQRSTVWY ",
};

export const formatSequence = (
  sequence: string,
  options: Record<string, unknown> = {},
): string => {
  const block = (options.block as number) || 10;
  const line = (options.line as number) || 50;

  const trimmedSeq = sequence.trim();
  let newSequence = "";
  for (let pos = 0; pos < trimmedSeq.length; pos += block) {
    if (pos > 0 && pos % line === 0) newSequence = `${newSequence.trim()}\n`;
    newSequence += `${trimmedSeq.slice(pos, pos + block)} `;
  }
  return newSequence.trim();
};

const injectComments = (
  formattedSequence: string,
  comments: SequenceComments,
): string => {
  const commentPositions = Object.keys(comments).map(Number);
  if (!commentPositions.length) return formattedSequence;
  let newSeq = "";
  let pos = 0;
  formattedSequence.split("\n").forEach((line) => {
    newSeq += `${line}\n`;
    const { length } = line.replace(/\s/g, "");
    commentPositions
      .filter((cPos) => pos < cPos && cPos <= pos + length)
      .forEach((cPos) => {
        newSeq += `;${comments[cPos]}\n`;
      });
    pos += length;
  });

  return newSeq.trim();
};

export const cleanUpText = (
  text: string,
  alphabet = alphabets.protein,
  caseSensitive = false,
  removeComments = true,
  single = true,
  disableHeaderCheck = false,
  format = formatSequence,
) => {
  const sequences: SequenceObject[] = [];
  let current = -1;

  // Add a header if missing one
  if (!text.trim().startsWith(">")) {
    sequences.push({
      header: disableHeaderCheck
        ? ""
        : `Generated Header [${Math.round(10000 * Math.random())}]`,
      sequence: "",
      comments: {},
    });
    current = 0;
  }
  text
    .trim()
    .split("\n")
    .forEach((line) => {
      if (line.startsWith(">")) {
        sequences.push({
          header: line.slice(1).trim(),
          sequence: "",
          comments: {},
        });
        current++;
      } else if (line.startsWith(";")) {
        if (!removeComments) {
          const lengthSoFar = sequences[current].sequence.length;
          if (!(lengthSoFar in sequences[current].comments))
            sequences[current].comments[lengthSoFar] = "";
          sequences[current].comments[lengthSoFar] += ` ${line
            .slice(1)
            .trim()}`;
        }
      } else {
        sequences[current].sequence += line
          .replace(/\s/g, "")
          .replace(
            new RegExp(`([^${alphabet}])`, caseSensitive ? "g" : "ig"),
            "",
          );
      }
    });
  return (single ? sequences.slice(0, 1) : sequences)
    .map(
      ({ header, sequence, comments }) =>
        `${header ? `> ${header}\n` : ""}${injectComments(
          format(sequence),
          comments,
        )}`,
    )
    .join("\n\n");
};
