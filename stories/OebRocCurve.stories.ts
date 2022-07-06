import { html } from "lit-html";
import "../packages/oeb-roc-curve/src/index.ts";

export default {
  title: "OpenEBench/RocCurve",
};

const Template = (args) => {
  const { width, height, title } = args;
  return html`<oeb-roc-curve
    width="${width}"
    height="${height}"
  ></oeb-roc-curve>`;
};

export const Navigation = Template.bind({});
Navigation.args = {
  width: "600",
  height: "500",
};