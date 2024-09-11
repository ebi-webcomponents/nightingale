import { CustomElementProperty } from "molstar/lib/mol-model-props/common/custom-element-property";
import { Color } from "molstar/lib/mol-util/color";
import { scaleLinear, color } from "d3";

const AM_COLOR_SCALE = {
  checkpoints: [0, 0.1132, 0.2264, 0.3395, 0.4527, 0.5895, 0.7264, 0.8632, 1],
  colors: [
    "#2166ac",
    "#4290bf",
    "#8cbcd4",
    "#c3d6e0",
    "#e2e2e2",
    "#edcdba",
    "#e99e7c",
    "#d15e4b",
    "#b2182b",
  ],
};

const amColorScale = scaleLinear(
  AM_COLOR_SCALE.checkpoints,
  AM_COLOR_SCALE.colors
);

// eslint-disable-next-line no-magic-numbers
const defaultColor = Color(0x000000);

const rowSplitter = /\s*\n\s*/;
const cellSplitter = /^(.)(\d+)(.),(.+),(\w+)$/;

const hexToPDBeMolstarColor = (hexColor: string) => {
  const rgb = color(hexColor)?.rgb() || { r: 100, g: 100, b: 100 };
  return { r: rgb.r, g: rgb.g, b: rgb.b };
};

const getAverage = (scores: number[]) => {
  return scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
};

export const AlphaMissenseColorTheme = CustomElementProperty.create({
  label: "Colour by Alphamissense pathogenecity",
  name: "basic-wrapper-am-coloring",
  getData: async (model) => {
    const map = new Map();
    if (model.entry.startsWith("AF")) {
      const residueIndex = model.atomicHierarchy.residueAtomSegments.index;
      const residueRowCount = model.atomicHierarchy.atoms._rowCount;
      const response = await fetch(
        `https://alphafold.ebi.ac.uk/files/${model.entry}-aa-substitutions.csv`
      );
      const rawText = await response.text();

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

      for (let i = 0; i < residueRowCount; i++) {
        const averageScore = getAverage(scores[residueIndex[i]]);
        map.set(i, averageScore);
      }
    }
    return { value: map };
  },
  coloring: {
    getColor: (e) => {
      const { r, g, b } = hexToPDBeMolstarColor(amColorScale(e));
      return Color.fromRgb(r, g, b);
    },
    defaultColor: defaultColor,
  },
  getLabel: (e) => {
    return `Pathogenecity Score: ${e}`;
  },
});
