import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-structure/src/index.ts";

export default {
  title: "Components/Structure",
} as Meta;

const Template: Story<{
  "protein-accession": string;
  "structure-id": string;
  highlight: string;
  "--custom-structure-height": string;
}> = (args) => {
  return html` <h3>Structure</h3>
    <h3>Structure viewer</h3>
    <nightingale-structure
      id="track"
      protein-accession="${args["protein-accession"]}"
      structure-id="${args["structure-id"]}"
      highlight="${args["highlight"]}"
      style="--custom-structure-height: ${args["--custom-structure-height"]}"
    ></nightingale-structure>`;
};

export const Structure = Template.bind({});
Structure.args = {
  "protein-accession": "P05067",
  "structure-id": "1AAP",
  highlight: "290:315",
  "--custom-structure-height": "480px",
};
Structure.play = async () => {
  await customElements.whenDefined("nightingale-structure");
  const track = document.getElementById("viewer");
  // if (track) {
  //   (track as any).data = tinyData;
  // }
};
