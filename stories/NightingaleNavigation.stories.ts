import { html } from "lit-html";
import "../packages/nightingale-navigation/src/index.ts";

export default {
  title: "Nightingale/NightingaleNavigation",
};

const Template = ({
  width,
  height,
  length,
  displaystart,
  displayend,
  highlightStart,
  highlightEnd,
  rulerstart,
}) =>
  html`<nightingale-navigation
    width="${width}"
    height=${height}
    length="${length}"
    displaystart=${displaystart}
    displayend=${displayend}
    highlightStart=${highlightStart}
    highlightEnd=${highlightEnd}
    rulerstart=${rulerstart}
  ></nightingale-navigation>`;

export const Navigation = Template.bind({});
Navigation.args = {
  width: "500",
  height: "100",
  length: "456",
  displaystart: "100",
  displayend: "200",
  highlightStart: "23",
  highlightEnd: "45",
  rulerstart: "50",
};

export const DifferentSelection = Template.bind({});
DifferentSelection.args = {
  ...Navigation.args,
  displaystart: "300",
  displayend: "350",
};

export const NavigationNoControls = () => html`<nightingale-navigation
  length="456"
  displaystart="143"
  displayend="400"
  highlightStart="23"
  highlightEnd="45"
  rulerstart="50"
/>`;
