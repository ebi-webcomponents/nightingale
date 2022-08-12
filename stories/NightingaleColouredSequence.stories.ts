import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../packages/nightingale-coloured-sequence/src/index.ts";

export default {
  title: "Nightingale/NightingaleColouredSequence",
  argTypes: {
    scale: {
      options: [
        "hydrophobicity-interface-scale",
        "hydrophobicity-octanol-scale",
        "hydrophobicity-scale",
        "isoelectric-point-scale",
      ],
      control: { type: "radio" },
    },
  },
} as Meta;

const defaultSequence = "iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV";

const coordinates = [
  [1.6, 5],
  [6, 13],
  [43, 50],
  [10, 30],
  [1, 50],
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
  html`<h3>Same Scale - different levels of zoom</h3>
    <nightingale-coloured-sequence
      sequence=${args.sequence}
      length=${args.sequence.length}
      width="800"
      height="40"
      display-start=${args["display-start"]}
      display-end=${args["display-end"]}
      color-range=${args["color-range"]}
      scale=${args.scale}
    ></nightingale-coloured-sequence> `;
ScalesWithControls.args = {
  scale: "hydrophobicity-scale",
  sequence: defaultSequence,
  width: 500,
  height: 50,
  "display-start": 1,
  "display-end": 50,
  "color-range": "",
};
export const ColouredSequenceNoControls = () =>
  html`<h3>Same Scale - different levels of zoom</h3>
    ${coordinates.map(
      ([start, end]) => html`
        <nightingale-coloured-sequence
          sequence=${defaultSequence}
          width="800"
          height="40"
          length=${defaultSequence.length}
          display-start=${start}
          display-end=${end}
          highlight="3:15"
          scale="hydrophobicity-scale"
        ></nightingale-coloured-sequence>
      `
    )} `;

export const CustomScale = () =>
  html`<h3>Custom Scale</h3>
    <pre>T:-2,R:-2,Y:-2,F:2,A:2,I:2,L:2</pre>
    ${coordinates.map(
      ([start, end]) => html`
        <nightingale-coloured-sequence
          sequence=${defaultSequence}
          width="800"
          height="40"
          length=${defaultSequence.length}
          display-start=${start}
          display-end=${end}
          highlight="3:15"
          scale="T:-2,R:-2,Y:-2,F:2,A:2,I:2,L:2""
          color-range="#ff0000:-2,#00FF00:2"
        ></nightingale-coloured-sequence>
      `
    )} `;
