import { scaleLinear } from "d3";

// AlphaMissense pathogenicity scores (0 = likely benign, 1 = likely
// pathogenic), coloured as on the AlphaFold DB website.
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

/** Colour for an AlphaMissense pathogenicity score, as an `rgb(...)` string. */
export const amColorScale = scaleLinear(
  AM_COLOR_SCALE.checkpoints,
  AM_COLOR_SCALE.colors,
);
