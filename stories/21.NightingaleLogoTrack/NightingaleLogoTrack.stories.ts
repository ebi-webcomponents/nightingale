import type { ArgTypes } from "@storybook/web-components";
import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-logo-track/src/index";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";
import "../../packages/nightingale-msa/src/index.ts";
import type { MsaSequence } from "../../packages/nightingale-logo-track/src/index";


export default { title: "Components/Tracks/Logo Track" } as Meta;


// Sample RNA MSA with varying conservation across positions.
// Positions 1-3: highly conserved (AAA)
// Positions 4-6: variable
// Positions 7-9: moderately conserved
// Positions 10-12: mixed
// Positions 13-20: variable
const sampleSequences: MsaSequence[] = [
  { name: "seq01", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq02", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq03", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
  { name: "seq04", sequence: "AAACUCGGGCUUAUGCAGCCGGU" },
  { name: "seq05", sequence: "AAAGUUGGGCUUAUGCAACCGAU" },
  { name: "seq06", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq07", sequence: "AAAGUCGAGCUUAUGCAACCGGU" },
  { name: "seq08", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
  { name: "seq09", sequence: "AAACUCGGGCUUAUGCAGCCGGU" },
  { name: "seq10", sequence: "AAAGUUGGGCUUAUGCAACCGAU" },
  { name: "seq11", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq12", sequence: "AAAGUCUGGCUUAUGCAACCGCU" },
  { name: "seq13", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
  { name: "seq14", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq15", sequence: "AAAGUUGGGCUUAUGCAACCGUU" },
  { name: "seq16", sequence: "AAAGUCGGGCUCAUGCAACCGGU" },
  { name: "seq17", sequence: "AAACCCGGGCUUAUGCAACCGGU" },
  { name: "seq18", sequence: "AAAGUCGGGCUUAUGCAACCGGU" },
  { name: "seq19", sequence: "AAAGUCGAGCUUAUGCAACCGGU" },
  { name: "seq20", sequence: "AAAGUUGGGCUUAUGCAACUGGU" },
];

const sequenceLength = sampleSequences[0].sequence.length;


const DefaultArgs = {
  "height": 120,
  "min-width": 400,
  "margin-top": 10,
  "margin-bottom": 10,
  "highlight-event": "onmouseover",
  "highlight-color": "#EB3BFF22",
  "margin-color": "#ffffffdd",
  "use-ctrl-to-zoom": true,
};
type Args = typeof DefaultArgs;

const ArgumentTypes: Partial<ArgTypes<Args>> = {
  "highlight-event": { control: "select", options: ["onmouseover", "onclick"] },
};


function nightingaleNavigation(args: Args) {
  return html`
    <div class="row">
      <div class="label"></div>
      <nightingale-navigation
        id="navigation"
        min-width="${args["min-width"]}"
        height="44"
        length="${sequenceLength}"
        highlight-color=${args["highlight-color"]}
        margin-color=${args["margin-color"]}
        show-highlight
        ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
      ></nightingale-navigation>
    </div>`;
}

function nightingaleLogoTrack(args: Args) {
  return html`
    <div class="row">
      <div class="label">Logo</div>
      <nightingale-logo-track
        id="logo-track"
        min-width="${args["min-width"]}"
        height="${args["height"]}"
        length="${sequenceLength}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color="${args["margin-color"]}"
        margin-top="${args["margin-top"]}"
        margin-bottom="${args["margin-bottom"]}"
        ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
      ></nightingale-logo-track>
    </div>`;
}

function nightingaleMsaTrack(args: Args) {
  return html`
    <div class="row">
      <div class="label">MSA</div>
      <nightingale-msa
        id="msa-track"
        min-width="${args["min-width"]}"
        height="80"
        length="${sequenceLength}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color="${args["margin-color"]}"
        ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
      ></nightingale-msa>
    </div>`;
}


const LogoOnlyTemplate: Story<Args> = (args: Args) => html`
  <span>Use Ctrl+scroll to zoom.</span>
  <div id="nightingale-root">
    <style>
      .row { line-height: 0; margin-top: 2px; display: flex; align-items: center; }
      .label { width: 75px; line-height: initial; font-size: 0.8rem; text-align: center; overflow: hidden; }
    </style>
    <nightingale-manager>
      <div style="display:flex; flex-direction: column; width: 100%;">
        ${nightingaleNavigation(args)}
        ${nightingaleLogoTrack(args)}
      </div>
    </nightingale-manager>
  </div>`;

LogoOnlyTemplate.args = { ...DefaultArgs };
LogoOnlyTemplate.argTypes = ArgumentTypes;
LogoOnlyTemplate.play = async () => {
  await customElements.whenDefined("nightingale-logo-track");
  document.querySelector("nightingale-manager")?.dispatchEvent(
    new CustomEvent("change", {
      bubbles: true,
      detail: { handler: "property", type: "sequences", value: sampleSequences },
    })
  );
};

export const LogoOnly = LogoOnlyTemplate.bind({});
LogoOnly.args = { ...DefaultArgs };
LogoOnly.argTypes = ArgumentTypes;
LogoOnly.play = LogoOnlyTemplate.play;



const LogoWithMsaTemplate: Story<Args> = (args: Args) => html`
  <span>Use Ctrl+scroll to zoom.</span>
  <div id="nightingale-root">
    <style>
      .row { line-height: 0; margin-top: 2px; display: flex; align-items: center; }
      .label { width: 75px; line-height: initial; font-size: 0.8rem; text-align: center; overflow: hidden; }
    </style>
    <nightingale-manager>
      <div style="display:flex; flex-direction: column; width: 100%;">
        ${nightingaleNavigation(args)}
        ${nightingaleLogoTrack(args)}
        ${nightingaleMsaTrack(args)}
      </div>
    </nightingale-manager>
  </div>`;

export const LogoWithMsa = LogoWithMsaTemplate.bind({});
LogoWithMsa.args = { ...DefaultArgs };
LogoWithMsa.argTypes = ArgumentTypes;
LogoWithMsa.play = async () => {
  await customElements.whenDefined("nightingale-logo-track");
  document.querySelector("nightingale-manager")?.dispatchEvent(
    new CustomEvent("change", {
      bubbles: true,
      detail: { handler: "property", type: "sequences", value: sampleSequences },
    })
  );
  await customElements.whenDefined("nightingale-msa");
  for (const track of document.getElementsByTagName("nightingale-msa")) {
    (track as any).data = sampleSequences;
  }
};


// ── Protein / amino-acid story ──────────────────────────────────────────────

// Sample protein MSA (β-lactamase active-site region, illustrative).
// Positions 1-4:  highly conserved (AMPC catalytic motif)
// Positions 5-10: variable loop
// Positions 11-16: conserved hydrophobic core
const proteinSequences: MsaSequence[] = [
  { name: "prot01", sequence: "AMSMSVLKHHFDA" },
  { name: "prot02", sequence: "AMSMSVLKHHFDA" },
  { name: "prot03", sequence: "AMSMSVLKHHFDA" },
  { name: "prot04", sequence: "AMSLSVLKHHFDA" },
  { name: "prot05", sequence: "AMSMAVLKHHFDA" },
  { name: "prot06", sequence: "AMSMSVLRHHFDA" },
  { name: "prot07", sequence: "AMSMSVLKHHFDS" },
  { name: "prot08", sequence: "AMSMSVLKHHFDA" },
  { name: "prot09", sequence: "AMSMSALKHHFDA" },
  { name: "prot10", sequence: "AMSMSVLKHHFNA" },
  { name: "prot11", sequence: "AMSMSVLKHHFDA" },
  { name: "prot12", sequence: "AMSMSVLKHYFDA" },
  { name: "prot13", sequence: "AMSMSVLKHHFDA" },
  { name: "prot14", sequence: "AMSMSVIKHHFDA" },
  { name: "prot15", sequence: "AMSMSVLKHHFDA" },
  { name: "prot16", sequence: "AMSMSVLKHHFEA" },
  { name: "prot17", sequence: "AMSMSVLKHHFDA" },
  { name: "prot18", sequence: "AMSLSVLKHHFDA" },
  { name: "prot19", sequence: "AMSMSVLKHHFDA" },
  { name: "prot20", sequence: "AMSMSVLLHHFDA" },
];

const proteinLength = proteinSequences[0].sequence.length;

const ProteinLogoTemplate: Story<Args> = (args: Args) => html`
  <span>Use Ctrl+scroll to zoom. Colors follow the WebLogo chemistry scheme:
    <span style="color:#FF8C00">■</span> hydrophobic &nbsp;
    <span style="color:#00CC00">■</span> polar &nbsp;
    <span style="color:#0000CC">■</span> positive &nbsp;
    <span style="color:#CC0000">■</span> negative
  </span>
  <div id="nightingale-root">
    <style>
      .row { line-height: 0; margin-top: 2px; display: flex; align-items: center; }
      .label { width: 75px; line-height: initial; font-size: 0.8rem; text-align: center; overflow: hidden; }
    </style>
    <nightingale-manager>
      <div style="display:flex; flex-direction: column; width: 100%;">
        <div class="row">
          <div class="label"></div>
          <nightingale-navigation
            id="navigation"
            min-width="${args["min-width"]}"
            height="44"
            length="${proteinLength}"
            highlight-color=${args["highlight-color"]}
            margin-color=${args["margin-color"]}
            show-highlight
            ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
          ></nightingale-navigation>
        </div>
        <div class="row">
          <div class="label">Logo</div>
          <nightingale-logo-track
            id="logo-track"
            min-width="${args["min-width"]}"
            height="${args["height"]}"
            length="${proteinLength}"
            highlight-event="${args["highlight-event"]}"
            highlight-color="${args["highlight-color"]}"
            margin-color="${args["margin-color"]}"
            margin-top="${args["margin-top"]}"
            margin-bottom="${args["margin-bottom"]}"
            ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
          ></nightingale-logo-track>
        </div>
        <div class="row">
          <div class="label">MSA</div>
          <nightingale-msa
            id="msa-track"
            min-width="${args["min-width"]}"
            height="80"
            length="${proteinLength}"
            highlight-event="${args["highlight-event"]}"
            highlight-color="${args["highlight-color"]}"
            margin-color="${args["margin-color"]}"
            ?use-ctrl-to-zoom="${args["use-ctrl-to-zoom"]}"
          ></nightingale-msa>
        </div>
      </div>
    </nightingale-manager>
  </div>`;

export const ProteinLogo = ProteinLogoTemplate.bind({});
ProteinLogo.args = { ...DefaultArgs };
ProteinLogo.argTypes = ArgumentTypes;
ProteinLogo.storyName = "Protein (amino acid) logo";
ProteinLogo.play = async () => {
  await customElements.whenDefined("nightingale-logo-track");
  document.querySelector("nightingale-manager")?.dispatchEvent(
    new CustomEvent("change", {
      bubbles: true,
      detail: { handler: "property", type: "sequences", value: proteinSequences },
    })
  );
  await customElements.whenDefined("nightingale-msa");
  for (const track of document.getElementsByTagName("nightingale-msa")) {
    (track as any).data = proteinSequences;
  }
};
