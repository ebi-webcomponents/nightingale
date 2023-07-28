import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-saver/src/index.ts";

export default {
  title: "Components/Utils/Saver",
} as Meta;

const Template: Story<{
  "file-name": string;
  "file-format": string;
  "background-color": string;
  "extra-width": number;
  "extra-height": number;
  "scale-factor": number;
  preview: boolean;
}> = (args) => {
  return html`<nightingale-navigation
      height="50"
      length="200"
      display-start="30"
      display-end="180"
      highlight="86:104"
      id="navigation"
    ></nightingale-navigation>
    <nightingale-saver
      element-id="navigation"
      file-name=${args["file-name"]}
      file-format=${args["file-format"]}
      background-color=${args["background-color"]}
      extra-width=${args["extra-width"]}
      extra-height=${args["extra-height"]}
      scale-factor=${args["scale-factor"]}
      ?preview=${args.preview}
    >
      <button>Save a Pic! 📸</button>
    </nightingale-saver> `;
};

export const Saver = Template.bind({});
Saver.args = {
  "file-name": "snapshot",
  "file-format": "jpeg",
  "background-color": "#ddddee",
  "extra-width": 0,
  "extra-height": 0,
  "scale-factor": 2,
  preview: true,
};
