import { html } from "lit-html";
import "../packages/nightingale-navigation/src/index.ts";
import "../packages/nightingale-manager/src/index.ts";

export default {
  title: "Nightingale/NightingaleManager",
};

const Template = ({ width, height, length }) =>
  html`
    <nightingale-manager>
      <nightingale-navigation
        width="${width}"
        height=${height}
        length="${length}"
      ></nightingale-navigation>
      <nightingale-navigation
        width="${width}"
        height=${height}
        length="${length}"
      ></nightingale-navigation>
    </nightingale-manager>
  `;

export const Manager = Template.bind({});
Manager.args = {
  width: "500",
  height: "100",
  length: "456",
};

// export const DifferentSelection = Template.bind({});
// DifferentSelection.args = {
//   ...Navigation.args,
//   displaystart: "300",
//   displayend: "350",
// };

// export const NavigationNoControls = () => html`<nightingale-navigation
//   length="456"
//   displaystart="143"
//   displayend="400"
//   highlightStart="23"
//   highlightEnd="45"
//   rulerstart="50"
// />`;
