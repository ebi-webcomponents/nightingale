import { html } from "lit-html";
import "../packages/oeb-pie-chart/src/index.ts";

export default {
  title: "OpenEBench/PieChart",
};

const Template = (args) => {
  const { width, height, title, val1, val2, label1, label2} = args;
  return html`<oeb-pie-chart
    width="${width}"
    height=${height}
    title="${title}"
    val1="${val1}"
    val2="${val2}"
    label1="${label1}"
    label2="${label2}"
  ></oeb-pie-chart>`;
};

export const Navigation = Template.bind({});
Navigation.args = {
  width: "800",
  height: "400",
  title: "Title",
  val1: "7",
  label1: "Label 1",
  val2: "3",
  label2: "Label 2",
};