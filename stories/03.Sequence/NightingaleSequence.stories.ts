import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-sequence/src/index.ts";

export default {
  title: "Components/Tracks/Sequence",
} as Meta;

const defaultSequence = "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDSDPSGT";

const Template: Story<{
  width: number;
  height: number;
  length: number;
  "display-start": number;
  "display-end": number;
  highlight: string;
  sequence: string;
}> = (args) => {
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
  width: 500,
  height: 100,
  length: defaultSequence.length,
  "display-start": 20,
  "display-end": 40,
  highlight: "23:45",
};

const coordinates = [
  [1.6, 5],
  [6, 13],
  [43, 50],
  [10, 30],
  [1, 50],
];
export const SequenceNoControls = () =>
  html`<h3>Same sequence with different coordinates</h3>
    ${coordinates.map(
      ([start, end]) => html`
        <nightingale-sequence
          sequence=${defaultSequence}
          height="40"
          length=${defaultSequence.length}
          display-start=${start}
          display-end=${end}
          highlight="3:15"
        ></nightingale-sequence>
      `,
    )} `;
