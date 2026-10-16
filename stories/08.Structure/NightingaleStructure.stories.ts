import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
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
  "color-theme": string;
  "hide-entry-emphasis": boolean;
  "entry-emphasis-opacity": number;
  "entry-chains": string;
  "--custom-structure-height": string;
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
      color-theme="${args["color-theme"]}"
      ?hide-entry-emphasis=${args["hide-entry-emphasis"]}
      entry-emphasis-opacity=${ifDefined(args["entry-emphasis-opacity"])}
      entry-chains=${ifDefined(args["entry-chains"])}
      style="--custom-structure-height: ${args["--custom-structure-height"]}"
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
  "color-theme": "alphafold",
  "--custom-structure-height": "480px",
};
AlphaFoldStructure.argTypes = {
  "color-theme": {
    control: "select",
    options: ["alphafold", "alphamissense"],
  },
};
AlphaFoldStructure.storyName = "AlphaFold Structure";

// The most valuable case for the entry emphasis: the gamma-secretase-APP
// complex, where P05067 only accounts for chain E of A-E. The residues SIFTS
// maps to P05067 (all of chain E) are framed and keep their colors while the
// rest of the complex, ligands included, is dimmed.
export const SmallPresenceInComplex = Template.bind({});
SmallPresenceInComplex.args = {
  "protein-accession": "P05067",
  "structure-id": "6IYC",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
};
SmallPresenceInComplex.storyName = "Small presence in a complex (6IYC)";

// Every residue of all six chains maps to P05067 and the entry has no ligands
// or waters, so nothing is dimmed.
export const AllChainsMapToEntry = Template.bind({});
AllChainsMapToEntry.args = {
  "protein-accession": "P05067",
  "structure-id": "8KF4",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
};
AllChainsMapToEntry.storyName = "All chains map to the entry (8KF4)";

export const StructureLoadByUrl = Template.bind({});
StructureLoadByUrl.args = {
  "model-url": "https://swissmodel.expasy.org/3d-beacons/uniprot/P05067.cif?range=30-189&template=7mrm.1.A&provider=swissmodel",
  // "model-url": "https://alphafill.eu/v1/aff/P05067",
  // "model-url": "https://shmoo.weizmann.ac.il/elevy/HomAtlas/Q9H221_V1_3.pdb",
  // Models loaded by URL carry no SIFTS mapping, so the entry's chains must be
  // named explicitly for the emphasis. 3D-Beacons publishes them per model as
  // `entities[].chain_ids` in its uniprot summary endpoint ("A" for this one).
  "entry-chains": "A",
  highlight: "30:189",
  "highlight-color": DEFAULT_HIGHLIGHT_COLOR,
  "--custom-structure-height": "480px",
};
