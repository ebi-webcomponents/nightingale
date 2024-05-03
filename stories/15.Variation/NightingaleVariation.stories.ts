import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-variation/src/index.ts";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-sequence/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";
// @ts-ignore
import rawVariation from "../../packages/nightingale-variation/tests/P99999.variation.json";

export default {
  title: "Components/Tracks/Variation",
} as Meta;

const Template: Story<{
  height: number;
  width: number;
  displayStart: number;
  displayEnd: number;
}> = (args) => {
  return html`
    <nightingale-variation
      id="variation"
      height=${args.height}
      display-start=${args.displayStart}
      display-end=${args.displayEnd}
      highlight="10:19,40:49"
      length=${rawVariation.sequence.length}
      protein-api
    ></nightingale-variation>
  `;
};

export const BasicVariation = Template.bind({});
BasicVariation.args = {
  height: 600,
  width: 800,
  displayStart: 1,
  displayEnd: 50,
};
BasicVariation.play = async () => {
  await customElements.whenDefined("nightingale-variation");
  const variationTrack = document.getElementById("variation");
  if (variationTrack) {
    (variationTrack as any).data = rawVariation;
    (variationTrack as any).colorConfig = (v: any) => {
      if (v.hasPredictions) return "green";
      return "#DD2121";
    };
  }
};

export const NightingaleVariation = () => html`
  <nightingale-manager style="width: 100%">
    <div>
      <nightingale-navigation
        height="50"
        length=${rawVariation.sequence.length}
        id="navigation"
      ></nightingale-navigation>
    </div>
    <div>
      <nightingale-sequence
        height="30"
        length=${rawVariation.sequence.length}
        id="sequence"
        sequence=${rawVariation.sequence}
        highlight-event="onmouseover"
      ></nightingale-sequence>
    </div>
    <nightingale-variation
      protein-api
      id="links-2"
      height="500"
      length=${rawVariation.sequence.length}
      highlight="3:20"
      highlight-color="rgba(30,200,20,0.2)"
      highlight-event="onmouseover"
    ></nightingale-variation>
  </nightingale-manager>
`;
NightingaleVariation.play = async () => {
  await customElements.whenDefined("nightingale-variation");
  const variation = document.getElementById("links-2");
  if (variation) (variation as any).data = rawVariation;
};
