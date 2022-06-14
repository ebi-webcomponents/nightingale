import { html } from "lit-html";
import "../packages/nightingale-navigation/src/index.ts";
import "../packages/nightingale-manager/src/index.ts";

export default {
  title: "Nightingale/NightingaleManager",
};

const Template = (args) => {
  const { width, height, length } = args;
  return html`
    <nightingale-manager>
      <nightingale-navigation
        width="${width}"
        height=${height}
        length="${length}"
        display-start="${args["display-start"]}"
        display-end="${args["display-end"]}"
      ></nightingale-navigation>
      <nightingale-navigation
        width="${width}"
        height=${height}
        length="${length}"
        display-start="${args["display-start"]}"
        display-end="${args["display-end"]}"
      ></nightingale-navigation>
    </nightingale-manager>
  `;
};

export const Manager = Template.bind({});
Manager.args = {
  width: "500",
  height: "100",
  length: "456",
  "display-start": "10",
  "display-end": "100",
};
