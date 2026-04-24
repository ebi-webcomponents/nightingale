import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-variation-canvas/src/index";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-sequence/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

import variationP99999 from "../../packages/nightingale-variation/tests/P99999.variation.json";
import variationP42336 from "../../packages/nightingale-variation/tests/P42336.variation.json";
import { ProteinsAPIVariation } from "../../packages/nightingale-variation/src/proteinAPI.js";

const data: Record<string, ProteinsAPIVariation> = {
  P99999: variationP99999 as unknown as ProteinsAPIVariation,
  P42336: variationP42336 as unknown as ProteinsAPIVariation,
};

export default {
  title: "Components/Tracks/NightingaleVariation-Canvas",
} as Meta;

const Template: Story<{
  rowHeight: number;
  width: number;
  displayStart: number;
  displayEnd: number;
  marginLeft: number;
  protein: "P99999" | "P42336";
  condensedView: boolean;
}> = (args) => {
  setTimeout(async () => {
    await customElements.whenDefined("nightingale-variation-canvas");
    const variationTrack = document.getElementById("variation-canvas");
    if (variationTrack) {
      (variationTrack as any).data = data[args.protein];
    }
  }, 500);
  return html`
    <nightingale-variation-canvas
      id="variation-canvas"
      row-height=${args.rowHeight}
      display-start=${args.displayStart}
      display-end=${args.displayEnd}
      length=${data[args.protein].sequence.length}
      margin-left=${args.marginLeft}
      ?condensed-view=${args.condensedView}
      protein-api
    ></nightingale-variation-canvas>
  `;
};

export const BasicVariationCanvas = Template.bind({});
BasicVariationCanvas.args = {
  rowHeight: 15,
  width: 800,
  displayStart: 1,
  displayEnd: 50,
  marginLeft: 20,
  protein: "P99999",
  condensedView: false,
};
BasicVariationCanvas.argTypes = {
  protein: {
    options: ["P99999", "P42336"],
    control: { type: "radio" },
  },
};

BasicVariationCanvas.play = async () => {
  await customElements.whenDefined("nightingale-variation-canvas");
  const variationTrack = document.getElementById("variation-canvas");
  if (variationTrack) {
    (variationTrack as any).colorConfig = (v: any) => {
      if (v.hasPredictions) return "green";
      return "#DD2121";
    };
  }
};

export const SvgVsCanvasSideBySide = () => html`
  <style>
    .row {
      margin-top: 4px;
    }
    .label {
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 2px;
    }
  </style>
  <nightingale-manager style="width: 100%">
    <div class="row">
      <nightingale-navigation
        height="50"
        length=${data.P99999.sequence.length}
        id="navigation"
        margin-left="20"
      ></nightingale-navigation>
    </div>
    <div class="row">
      <nightingale-sequence
        height="30"
        length=${data.P99999.sequence.length}
        id="sequence"
        sequence=${data.P99999.sequence}
        highlight-event="onmouseover"
        margin-left="20"
      ></nightingale-sequence>
    </div>
    <div class="row">
      <div class="label">SVG</div>
      <nightingale-variation
        protein-api
        id="variation-svg"
        row-height="15"
        length=${data.P99999.sequence.length}
        highlight-color="rgba(30,200,20,0.2)"
        highlight-event="onmouseover"
        margin-left="20"
        condensed-view
      ></nightingale-variation>
    </div>
    <div class="row">
      <div class="label">Canvas</div>
      <nightingale-variation-canvas
        protein-api
        id="variation-canvas-compare"
        row-height="15"
        length=${data.P99999.sequence.length}
        highlight-color="rgba(30,200,20,0.2)"
        highlight-event="onmouseover"
        margin-left="20"
        condensed-view
      ></nightingale-variation-canvas>
    </div>
  </nightingale-manager>
`;
SvgVsCanvasSideBySide.play = async () => {
  await customElements.whenDefined("nightingale-variation");
  await customElements.whenDefined("nightingale-variation-canvas");
  const svg = document.getElementById("variation-svg");
  if (svg) (svg as any).data = data.P99999;
  const canvas = document.getElementById("variation-canvas-compare");
  if (canvas) (canvas as any).data = data.P99999;
};
