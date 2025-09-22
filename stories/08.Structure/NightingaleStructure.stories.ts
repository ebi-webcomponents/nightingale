import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import { DEFAULT_HIGHLIGHT_COLOR } from "../../packages/nightingale-new-core/src/mixins/withHighlight";
import "../../packages/nightingale-structure/src/index.ts";

export default {
  title: "Components/Structure",
} as Meta;

const Template: Story<{
  "protein-accession": string;
  "structure-id": string;
  "model-url": string;
  highlight: string;
  "highlight-color": string;
  "--custom-structure-height": string;
  "color-theme": string;
}> = (args) => {
  return html` <h3>Structure</h3>
    <h3>Structure viewer</h3>
    <nightingale-structure
      id="track"
      protein-accession="${args["protein-accession"]}"
      structure-id="${args["structure-id"]}"
      model-url="${args["model-url"]}"
      highlight="${args["highlight"]}"
      highlight-color=${args["highlight-color"]}
      style="--custom-structure-height: ${args["--custom-structure-height"]}"
      color-theme="${args["color-theme"]}"
    ></nightingale-structure>`;
};

export const Structure = Template.bind({});
Structure.args = {
  "protein-accession": "P05067",
  "structure-id": "1AAP",
  highlight: "290:315",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
};

export const AlphaFoldStructure = Template.bind({});
AlphaFoldStructure.args = {
  "protein-accession": "P05067",
  "structure-id": "AF-P05067-F1",
  highlight: "290:315",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
  "color-theme": "alphamissense"
};
AlphaFoldStructure.storyName = "AlphaFold Structure";

export const StructureLoadByUrl = Template.bind({});
StructureLoadByUrl.args = {
  "model-url": "https://swissmodel.expasy.org/3d-beacons/uniprot/P05067.cif?range=30-189&template=7mrm.1.A&provider=swissmodel",
  // "model-url": "https://alphafill.eu/v1/aff/P05067",
  // "model-url": "https://shmoo.weizmann.ac.il/elevy/HomAtlas/Q9H221_V1_3.pdb",
  highlight: "30:189",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
};
