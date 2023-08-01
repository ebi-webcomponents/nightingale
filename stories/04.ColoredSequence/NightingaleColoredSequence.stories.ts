import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-colored-sequence/src/index.ts";

const scales = [
  "hydrophobicity-interface-scale",
  "hydrophobicity-octanol-scale",
  "hydrophobicity-scale",
  "isoelectric-point-scale",
  "T:-2,R:-2,Y:-2,F:2,A:2,I:2,L:2",
];
export default {
  title: "Components/Tracks/Colored Sequence",
  argTypes: {
    scale: {
      options: scales,
      control: { type: "radio" },
    },
  },
} as Meta;

const defaultSequence =
  "iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViuUBRUABBRWOAUVBISVBbcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV";

const coordinates = [
  [21.6, 24.3],
  [20, 23],
  [15, 25],
  [10, 30],
  [1, 50],
  [1, defaultSequence.length],
];
export const ScalesWithControls: Story<{
  sequence: string;
  scale: string;
  width: number;
  height: number;
  "display-start": number;
  "display-end": number;
  highlight: string;
  "color-range": string;
}> = (args) =>
  html`<h3>Colored Sequence with controls</h3>
    <nightingale-colored-sequence
      sequence=${args.sequence}
      length=${args.sequence.length}
      width=${args.width}
      height=${args.height}
      display-start=${args["display-start"]}
      display-end=${args["display-end"]}
      color-range=${args["color-range"]}
      scale=${args.scale}
    ></nightingale-colored-sequence> `;
ScalesWithControls.args = {
  scale: "hydrophobicity-scale",
  sequence: defaultSequence,
  width: 500,
  height: 50,
  "display-start": 1,
  "display-end": 50,
  "color-range": "",
};
export const ColoredSequenceNoControls = () =>
  html`<h3>Same Scale - different levels of zoom</h3>
    ${coordinates.map(
      ([start, end]) => html`
        <nightingale-colored-sequence
          sequence=${defaultSequence}
          height="20"
          length=${defaultSequence.length}
          display-start=${start}
          display-end=${end}
          highlight="3:15"
          scale="hydrophobicity-scale"
        ></nightingale-colored-sequence>
      `,
    )} `;

const twoCoordinates = [
  [20, 30],
  [1, defaultSequence.length],
];

export const ChangingScales = () =>
  html`<h3>Same sequence with different scales</h3>
    ${scales.map(
      (scale) => html`
        <pre>${scale}</pre>
        ${twoCoordinates.map(
          ([start, end]) => html`
            <nightingale-colored-sequence
              sequence=${defaultSequence}
              height="40"
              length=${defaultSequence.length}
              display-start=${start}
              display-end=${end}
              highlight="3:15"
              scale=${scale}
            ></nightingale-colored-sequence>
          `,
        )}
      `,
    )} `;

export const ChangingColorRange = () => {
  const ranges = [
    "#ff0000:-2,#00FF00:2",
    "#ff0000:-2,#FFFFFF:0,#00FF00:2",
    "#3434ED:-2,#ED3434:2",
    "yellow:-2,dodgerblue:2",
    "white:0,dodgerblue:2",
  ];
  return html`<h3>Same sequence with different color ranges</h3>
    ${ranges.map(
      (range) => html`
        <pre>${range}</pre>
        ${twoCoordinates.map(
          ([start, end]) => html`
            <nightingale-colored-sequence
              sequence=${defaultSequence}
              height="40"
              length=${defaultSequence.length}
              display-start=${start}
              display-end=${end}
              highlight="3:15"
              scale="hydrophobicity-scale"
              color-range=${range}
            ></nightingale-colored-sequence>
          `,
        )}
      `,
    )} `;
};
