const rowSplitter = /\s*\n\s*/;
const cellSplitter = /^(.)(\d+)(.),(.+),(\w+)$/;

const parseAMData = (rawText: string) => {
  const scores: Array<Array<number>> = [];

  for (const [i, row] of rawText.split(rowSplitter).entries()) {
    if (i === 0 || !row) {
      continue;
    }
    const cellContents = row.match(cellSplitter);
    if (!cellContents)
      throw new Error(
        `FormatError: cannot parse "${row}" as a mutation (should look like Y123A)`
      );
    const seqId = +cellContents[2];
    (scores[seqId - 1] ??= []).push(+cellContents[4]);
  }
  return scores;
};

export default parseAMData;
