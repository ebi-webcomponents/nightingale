import { html } from "lit-html";
import "../packages/oeb-barplot/src/index.ts";

export default {
  title: "OpenEBench/Barplot",
};

const Template = (args) => {
  const { width, height, length, highlight, rulerstart } = args;
  return html`<oeb-barplot
    width="${width}"
    height=${height}
    length="${length}"
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight=${highlight}
    rulerstart=${rulerstart}
  ></oeb-barplot>`;
};

export const Navigation = Template.bind({});
Navigation.args = {
  width: "500",
  height: "100",
  length: "456",
  "display-start": "100",
  "display-end": "200",
  highlight: "23:45",
  rulerstart: "50",
};

export const DifferentSelection = Template.bind({});
DifferentSelection.args = {
  ...Navigation.args,
  "display-start": "300",
  "display-end": "350",
};

export const NavigationNoControls = () => html`<oeb-barplot
  length="456"
  display-start="143"
  display-end="400"
  highlight="23:45"
  rulerstart="1"
/>`;
