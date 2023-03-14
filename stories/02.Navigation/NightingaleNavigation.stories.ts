import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";

export default {
  title: "Components/Utils/Navigation",
} as Meta;

const Template: Story<{
  width: number;
  height: number;
  length: number;
  "ruler-start": number;
  "ruler-padding": number;
  "display-start": number;
  "display-end": number;
  highlight: string;
}> = (args) => {
  const { width, height, length, highlight } = args;
  return html`<nightingale-navigation
    width="${width}"
    height=${height}
    length="${length}"
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight=${highlight}
    ruler-start=${args["ruler-start"]}
    ruler-padding=${args["ruler-padding"]}
  ></nightingale-navigation>`;
};

export const Navigation = Template.bind({});
Navigation.args = {
  width: 500,
  height: 100,
  length: 456,
  "display-start": 100,
  "display-end": 200,
  highlight: "23:45",
  "ruler-start": 50,
  "ruler-padding": 5,
};

export const DifferentSelection = Template.bind({});
DifferentSelection.args = {
  ...Navigation.args,
  "display-start": 300,
  "display-end": 350,
};

export const NavigationNoControls = () => html`
  <nightingale-navigation
    id="navigation"
    length="456"
    display-start="143"
    display-end="400"
    highlight="23:45"
    rulerstart="1"
    height="60"
  ></nightingale-navigation>
  <div>
    <button id="zoom-in">Zoom In</button>
    <button id="zoom-out">Zoom Out</button>
  </div>
  <script></script>
`;

NavigationNoControls.play = async () => {
  const nav = document.getElementById("navigation");
  document.getElementById("zoom-in")?.addEventListener("click", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nav as any)?.zoomIn();
  });
  document.getElementById("zoom-out")?.addEventListener("click", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nav as any)?.zoomOut();
  });
};
