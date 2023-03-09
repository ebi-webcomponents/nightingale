import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-sunburst/src/index.ts";

import data from "../../packages/nightingale-sunburst/test/taxonomy.json";

export default {
  title: "Components/Other/Sunburst",
  argTypes: {
    weightAttribute: {
      options: ["numSequences", "numSpecies", "numDomains"],
      control: { type: "radio" },
    },
    fontSize: {
      options: [8, 10, 12, 14, 16, 18, 20],
      control: { type: "select" },
    },
    maxDepth: {
      control: { type: "range", min: 1, max: 8, step: 1 },
    },
  },
  parameters: {
    actions: {
      handles: ["taxon-hover"],
    },
  },
} as Meta;

const Template: Story<{
  side: number;
  weightAttribute: string;
  nameAttribute: string;
  maxDepth: number;
  fontSize: number;
  showLabel: boolean;
}> = (args) => {
  return html`
    <nightingale-sunburst
      id="sunburst"
      side=${args.side}
      weight-attribute=${args.weightAttribute}
      name-attribute=${args.nameAttribute}
      max-depth=${args.maxDepth}
      font-size=${args.fontSize}
      .show-tooltip=${args.showLabel}
    ></nightingale-sunburst>
  `;
};

export const Sunburst = Template.bind({});
Sunburst.args = {
  side: 600,
  weightAttribute: "numSequences",
  nameAttribute: "node",
  maxDepth: 7,
  fontSize: 12,
  showLabel: true,
};
Sunburst.play = async () => {
  await customElements.whenDefined("nightingale-sunburst");
  const sunburst = document.getElementById("sunburst");
  if (sunburst) (sunburst as any).data = data;
};
