import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-links/src/index.ts";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

// @ts-ignore
import rawContactsHC from "../../packages/nightingale-links/tests/example.tsv";

export default {
  title: "Components/Tracks/Links",
} as Meta;

const Template: Story<{
  height: number;
  width: number;
  displayStart: number;
  displayEnd: number;
  minDistance: number;
  minProbability: number;
}> = (args) => {
  return html`
    <nightingale-links
      id="links"
      height=${args.height}
      display-start=${args.displayStart}
      display-end=${args.displayEnd}
      highlight="10:19,40:49"
      length="100"
      min-distance=${args.minDistance}
      min-probability=${args.minProbability}
    ></nightingale-links>
  `;
};

export const BasicLinks = Template.bind({});
BasicLinks.args = {
  height: 200,
  width: 800,
  displayStart: 1,
  displayEnd: 50,
  minDistance: 5,
  minProbability: 0.9,
};
BasicLinks.play = async () => {
  await customElements.whenDefined("nightingale-links");
  const links = document.getElementById("links");
  if (links) (links as any).contacts = rawContactsHC;
};

export const NightingaleLinks = () => html`
  <nightingale-manager style="width: 100%">
    <div>
      <nightingale-navigation
        height="50"
        length="100"
        id="navigation"
      ></nightingale-navigation>
    </div>
    <nightingale-links
      id="links-2"
      height="50"
      length="100"
      display-start="1"
      display-end="90"
      highlight="3:20"
      highlight-color="red"
    ></nightingale-links>
  </nightingale-manager>
`;
NightingaleLinks.play = async () => {
  await customElements.whenDefined("nightingale-links");
  const links = document.getElementById("links-2");
  if (links) (links as any).contacts = rawContactsHC;
};
