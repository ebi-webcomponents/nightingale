import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-overlay/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

export default {
  title: "Components/Utils/Overlay",
  argTypes: {
    for: {
      options: ["all", "navigation", "sequence", "div"],
      control: { type: "radio" },
    },
  },
} as Meta;

const Template: Story<{
  for: string;
  label: string;
}> = (args) => {
  return html`
    <div
      id="all"
      style="
      height: 200px; 
      overflow: scroll;
      border: 7px solid #c7dcec;
    "
    >
      <nightingale-manager>
        <nightingale-navigation
          height="50"
          length="27"
          id="navigation"
        ></nightingale-navigation>
        <nightingale-sequence
          id="sequence"
          height="50"
          sequence="THISISANEXAMPLEFORASEQUENCE"
          length="27"
          use-ctrl-to-zoom
        ></nightingale-sequence>
      </nightingale-manager>
      <div id="div" style="background:red;width: 300px;height: 300px;"></div>
    </div>
    <nightingale-overlay
      for=${args["for"]}
      label=${args["label"]}
    ></nightingale-overlay>
  `;
};

export const Overlay = Template.bind({});
Overlay.args = {
  for: "all",
  label: "Use [CTRL] + scroll to zoom",
};
