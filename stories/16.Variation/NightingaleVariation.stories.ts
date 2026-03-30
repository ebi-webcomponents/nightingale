import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-variation/src/index.ts";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-sequence/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

import variationP99999 from "../../packages/nightingale-variation/tests/P99999.variation.json";
import variationP42336 from "../../packages/nightingale-variation/tests/P42336.variation.json";
import { ProteinsAPIVariation } from "../../packages/nightingale-variation/src/proteinAPI.js";
import NightingaleVariationType, {
  VariationDatum,
} from "../../packages/nightingale-variation/src";

const data: Record<string, ProteinsAPIVariation> = {
  P99999: variationP99999 as unknown as ProteinsAPIVariation,
  P42336: variationP42336 as unknown as ProteinsAPIVariation,
};

export default {
  title: "Components/Tracks/Variation",
} as Meta;

const randomColorConfig = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

const predictionColorConfig = (v: VariationDatum) =>
  v.originalData.predictions ? "orange" : "blue";

const Template: Story<{
  rowHeight: number;
  width: number;
  displayStart: number;
  displayEnd: number;
  marginLeft: number;
  protein: "P99999" | "P42336";
  condensedView: boolean;
  colorConfig: "random" | "prediction";
}> = (args) => {
  setTimeout(async () => {
    await customElements.whenDefined("nightingale-variation");
    const variationTrack = document.getElementById("variation");
    if (variationTrack) {
      (variationTrack as NightingaleVariationType).data = data[args.protein];
      (variationTrack as NightingaleVariationType).colorConfig =
        args.colorConfig === "random"
          ? randomColorConfig
          : predictionColorConfig;
    }
  }, 0);
  return html`
    <nightingale-variation
      id="variation"
      row-height=${args.rowHeight}
      display-start=${args.displayStart}
      display-end=${args.displayEnd}
      length=${data[args.protein].sequence.length}
      margin-left=${args.marginLeft}
      ?condensed-view=${args.condensedView}
      protein-api
    ></nightingale-variation>
  `;
};

export const BasicVariation = Template.bind({});
BasicVariation.args = {
  rowHeight: 15,
  width: 800,
  displayStart: 1,
  displayEnd: 50,
  marginLeft: 20,
  protein: "P99999",
  condensedView: false,
  colorConfig: "random",
};
BasicVariation.argTypes = {
  protein: {
    options: ["P99999", "P42336"],
    control: { type: "radio" },
  },
  colorConfig: {
    options: ["random", "prediction"],
    control: { type: "radio" },
  },
};

export const NightingaleVariation = () => html`
  <nightingale-manager style="width: 100%">
    <div>
      <nightingale-navigation
        height="50"
        length=${data.P99999.sequence.length}
        id="navigation"
        margin-left="20"
      ></nightingale-navigation>
    </div>
    <div>
      <nightingale-sequence
        height="30"
        length=${data.P99999.sequence.length}
        id="sequence"
        sequence=${data.P99999.sequence}
        highlight-event="onmouseover"
        margin-left="20"
      ></nightingale-sequence>
    </div>
    <nightingale-variation
      protein-api
      id="links-2"
      row-height="15"
      length=${data.P99999.sequence.length}
      highlight-color="rgba(30,200,20,0.2)"
      highlight-event="onmouseover"
      margin-left="20"
      condensed-view
    ></nightingale-variation>
  </nightingale-manager>
`;
NightingaleVariation.play = async () => {
  await customElements.whenDefined("nightingale-variation");
  const variation = document.getElementById("links-2");
  if (variation) {
    (variation as NightingaleVariationType).data = data.P99999;
  }
};
