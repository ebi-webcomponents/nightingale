import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-textarea-sequence/src/index.ts";

export default {
  title: "Components/Other/Textarea Sequence",
} as Meta;

export const TextareaWithoutControls = () => html`
  <h3>Textarea</h3>
  <h3>Protein alphabet</h3>
  <nightingale-textarea-sequence
    id="track"
    min-sequence-length="5"
    width="800"
    height="400"
  ></nightingale-textarea-sequence>
`;

const Template: Story<{
  width: number;
  height: number;
  "min-sequence-length": number;
  "case-sensitive": boolean;
  "inner-style": string;
  alphabet: string;
}> = (args) => {
  const { width, height, alphabet } = args;
  return html`
    <nightingale-textarea-sequence
      id="tracki"
      min-sequence-length=${args["min-sequence-length"]}
      inner-style=${args["inner-style"]}
      ?case-sensitive=${args["case-sensitive"]}
      width=${width}
      height=${height}
      alphabet=${alphabet}
    ></nightingale-textarea-sequence>
  `;
};

export const TextareaSequence = Template.bind({});
TextareaSequence.args = {
  width: 500,
  height: 100,
  "min-sequence-length": 5,
  "case-sensitive": false,
  alphabet: "protein",
  "inner-style": "background: pink",
};
