import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-sequence-heatmap/src/index.ts";
import {
  xDomain,
  yDomain,
  data,
} from "../../packages/nightingale-sequence-heatmap/tests/mockData/mockdata";

export default {
  title: "Components/Tracks/SequenceHeatmap",
} as Meta;

const Template: Story<{
  "element-id": string;
  width: number;
  height: number;
  "display-start": number;
  "display-end": number;
  "highlight-color": string;
}> = (args) => {
  const { width, height } = args;
  return html`<nightingale-sequence-heatmap
    heatmap-id=${args["element-id"]}
    width="${width}"
    height=${height}
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight-event="onmouseover"
    highlight-color=${args["highlight-color"]}
  ></nightingale-sequence-heatmap>`;
};

export const SequenceHeatmap = Template.bind({});
SequenceHeatmap.args = {
  width: 500,
  height: 500,
  "element-id": "heatmapId1",
  "display-start": 1,
  "display-end": 50,
};
SequenceHeatmap.play = async () => {
  await customElements.whenDefined("nightingale-sequence-heatmap");
  const heatmapElement = document.getElementsByTagName(
    "nightingale-sequence-heatmap",
  )[0] as any;
  if (heatmapElement) heatmapElement.setHeatmapData(xDomain, yDomain, data);
};
