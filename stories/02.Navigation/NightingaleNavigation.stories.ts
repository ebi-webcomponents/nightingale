import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";

export default {
  title: "Components/Navigation",
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

export const NavigationNoControls = () => html`<nightingale-navigation
  length="456"
  display-start="143"
  display-end="400"
  highlight="23:45"
  rulerstart="1"
  height="60"
/>`;
