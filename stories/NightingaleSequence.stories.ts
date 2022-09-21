import { html } from "lit-html";
import "../packages/nightingale-sequence/src/index.ts";

export default {
  title: "Nightingale/NightingaleSequence",
};
const defaultSequence = "iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASV";
const Template = (args) => {
  const { sequence, width, height, length, highlight } = args;
  return html`<nightingale-sequence
    sequence=${sequence}
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight=${highlight}
    width="${width}"
    height=${height}
    length="${length}"
  ></nightingale-sequence>`;
};

export const Sequence = Template.bind({});
Sequence.args = {
  sequence: defaultSequence,
  width: "500",
  height: "100",
  length: defaultSequence.length,
  "display-start": "20",
  "display-end": "40",
  highlight: "23:45",
};

// export const DifferentSelection = Template.bind({});
// DifferentSelection.args = {
//   ...Navigation.args,
//   "display-start": "300",
//   "display-end": "350",
// };

const coordinates = [
  [1.6, 5],
  [6, 13],
  [43, 50],
  [10, 30],
  [1, 50],
];
export const SeqeunceNoControls = () =>
  html`<h3>Same sequence with different coordinates</h3>
    ${coordinates.map(
      ([start, end]) => html`
        <nightingale-sequence
          sequence=${defaultSequence}
          width="800"
          height="40"
          length=${defaultSequence.length}
          display-start=${start}
          display-end=${end}
          highlight="3:15"
        ></nightingale-sequence>
      `
    )} `;
