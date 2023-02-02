import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-heatmap/src/index.ts";

import data from "../../packages/nightingale-heatmap/test/contact-map.json";

export default {
  title: "Components/Other/Heatmap",
  argTypes: {
    topColor: {
      control: {
        type: "color",
      },
    },
    bottomColor: {
      control: {
        type: "color",
      },
    },
  },
  parameters: {
    actions: {
      handles: ["change"],
    },
  },
} as Meta;

const Template: Story<{
  width: number;
  height: number;
  symmetric: boolean;
  bottomColor: string;
  topColor: string;
  xLabel: string;
  yLabel: string;
}> = (args) => {
  return html`
    <nightingale-heatmap
      id="heatmap"
      width=${args.width}
      height=${args.height}
      bottom-color=${args.bottomColor}
      top-color=${args.topColor}
      x-label=${args.xLabel}
      y-label=${args.yLabel}
      margin-left="50"
      margin-bottom="50"
      .symmetric=${args.symmetric}
    />
  `;
};

export const Heatmap = Template.bind({});
Heatmap.args = {
  width: 300,
  height: 300,
  symmetric: true,
  topColor: "yellow",
  bottomColor: "darkblue",
  xLabel: "Base",
  yLabel: "Base",
};
Heatmap.play = async () => {
  await customElements.whenDefined("nightingale-heatmap");
  const heatmap = document.getElementById("heatmap");
  if (heatmap) (heatmap as any).data = data.value;
};
