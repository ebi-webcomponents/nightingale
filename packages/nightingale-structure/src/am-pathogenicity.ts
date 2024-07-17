import { color, scaleLinear } from "d3";

/** RGB color with values 0-255 */
export interface PDBeMolstarColor {
  r: number,
  g: number,
  b: number,
}

// export async function colorByAlphaMissense(viewerInstance: PDBeMolstar, data: string, filters?: any) {
//   const colors = extractColors(data, filters);
//   const selectionObject = {
//     data: [
//       { struct_asym_id: 'A', color: BASE_COLOR },
//       ...colors.map(res => ({ struct_asym_id: 'A', residue_number: res.seqId, color: res.color })),
//       // TODO here I assume the model is always chain A, is it correct?
//     ],
//     keepRepresentations: true,
//   };
//   await viewerInstance.visual.select(selectionObject);
//   // console.timeEnd('colorByAlphaMissense');
// }

// export async function resetColoring(viewerInstance: PDBeMolstar) {
//   await viewerInstance.visual.clearSelection(undefined, { keepRepresentations: true });
// }


// export async function applyAlphaMissenseTooltips(viewerInstance: PDBeMolstar, data: string) {
//   const colors = extractColors(data);
//   await viewerInstance.visual.tooltips({
//     data: colors.map(res => ({
//       struct_asym_id: 'A',
//       residue_number: res.seqId,
//       tooltip: `Average AlphaMissense pathogenicity score: ${res.score.toFixed(3)}`,
//     })),
//   });
// }

// export async function resetTooltips(viewerInstance: PDBeMolstar) {
//   await viewerInstance.visual.clearTooltips();
// }


// const BASE_COLOR: PDBeMolstarColor = { r: 100, g: 100, b: 100 };

export const AM_COLOR_SCALE = {
  checkpoints: [0, 0.1132, 0.2264, 0.3395, 0.4527, 0.5895, 0.7264, 0.8632, 1],
  colors: ['#2166ac', '#4290bf', '#8cbcd4', '#c3d6e0', '#e2e2e2', '#edcdba', '#e99e7c', '#d15e4b', '#b2182b'],
  invalidColor: '#000000',
}
/** Return mean score and mean-score-based color for each residue */
export const extractColors = (data: string): { seqId: number, score: number, color: PDBeMolstarColor }[] => {
  const DELIMITER = ',';
  const MUTATION_COLUMN = 0;
  const SCORE_COLUMN = 1;
  const N_HEADER_ROWS = 0;

  const lines = data.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('#'));
  if (N_HEADER_ROWS > 0) lines.splice(0, N_HEADER_ROWS);
  const rows = lines.map(line => line.split(DELIMITER));
  rows.shift();
  const scores: { [seqId: number]: number[] } = {};
  for (const row of rows) {
    const mutation = row[MUTATION_COLUMN];
    const score = Number(row[SCORE_COLUMN]);

    const match = mutation.match(/([A-Za-z]+)([0-9]+)([A-Za-z]+)/);
    if (!match) throw new Error(`FormatError: cannot parse "${mutation}" as a mutation (should look like Y123A)`)
    const seqId = +match[2];
    (scores[seqId] ??= []).push(score);
  }

  const colors: { seqId: number, score: number, color: PDBeMolstarColor }[] = [];
  for (const seqId in scores) {
    const aggrScore = mean(scores[seqId]); // The original paper also uses mean (https://www.science.org/doi/10.1126/science.adg7492)
    const color = assignColor(aggrScore);
    colors.push({ seqId: Number(seqId), score: aggrScore, color });
  }
  return colors;
}

const mean = (values: number[]): number => {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const amColorScale = scaleLinear(AM_COLOR_SCALE.checkpoints, AM_COLOR_SCALE.colors);

/** Map a score within [0, 1] to a color based on AM_COLOR_SCALE */
const assignColor = (score: number): PDBeMolstarColor => {
  if (score >= 0 && score <= 1) {
    return hexToPDBeMolstarColor(amColorScale(score));
  } else {
    return hexToPDBeMolstarColor(AM_COLOR_SCALE.invalidColor);
  }
}

const hexToPDBeMolstarColor = (hexColor: string): PDBeMolstarColor => {
  const rgb = color(hexColor)?.rgb() || { r: 100, g: 100, b: 100 };
  return { r: rgb.r, g: rgb.g, b: rgb.b };
}