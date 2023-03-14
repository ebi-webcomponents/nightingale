import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-msa/src/index.ts";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

import { defaultSchemes } from "../../packages/nightingale-msa/src/colorschemes";

// @ts-ignore
import rawContactsHC from "../../packages/nightingale-links/tests/example.tsv";

export default {
  title: "Components/Tracks/Alignments",
  argTypes: {
    colorScheme: {
      options: defaultSchemes,
      control: { type: "select" },
    },
  },
} as Meta;
const testSequences = [
  {
    name: "seq1",
    sequence:
      "r1XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII----XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII",
  },
  {
    name: "seq2",
    sequence:
      "R2XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXX-XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXXR",
  },
  {
    name: "seq3",
    sequence:
      "R3XAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJIIssssXAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJII",
  },
  {
    name: "seq4",
    sequence:
      "R4XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXX-XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXXR",
  },
];

const Template: Story<{
  height: number;
  width: number;
  colorScheme: string;
  displayStart: number;
  displayEnd: number;
}> = (args) => {
  return html`
    <nightingale-msa
      id="msa"
      height=${args.height}
      width=${args.width}
      color-scheme=${args.colorScheme}
      display-start=${args.displayStart}
      display-end=${args.displayEnd}
      label-width="200"
      highlight="10:19,40:49"
    ></nightingale-msa>
  `;
};

export const MSA = Template.bind({});
MSA.args = {
  height: 200,
  width: 800,
  colorScheme: "aliphatic",
  displayStart: 1,
  displayEnd: 50,
};
MSA.play = async () => {
  await customElements.whenDefined("nightingale-msa");
  const msa = document.getElementById("msa");
  if (msa)
    (msa as any).data = [...testSequences, ...testSequences, ...testSequences];
};

export const MinimalMSA = () => html`
  <nightingale-manager style="width: 100%">
    <div style="padding-left: 100px">
      <nightingale-navigation
        height="50"
        length="184"
        id="navigation"
      ></nightingale-navigation>
    </div>
    <nightingale-msa
      id="msa-2"
      height="200"
      color-scheme="clustal2"
      label-width="100"
      highlight="3:20"
      highlight-color="red"
    ></nightingale-msa>
  </nightingale-manager>
`;
MinimalMSA.play = async () => {
  await customElements.whenDefined("nightingale-msa");
  const msa = document.getElementById("msa-2");
  if (msa)
    (msa as any).data = [
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
      ...testSequences,
    ];
};
export const LinksAndMSA = () => html`
  <nightingale-manager style="width: 100%">
    <div style="padding-left: 100px">
      <nightingale-navigation
        height="50"
        length="184"
        id="navigation"
      ></nightingale-navigation>
    </div>
    <div style="display:flex">
      <div
        style="width: 100px; line-height:1rem; flex-grow: 1;display: flex; align-items: center;"
      >
        Contacts
      </div>
      <div style="flex-grow: 1;">
        <nightingale-links
          id="links"
          height="50"
          length="184"
        ></nightingale-links>
      </div>
    </div>
    <nightingale-msa
      id="msa-3"
      height="200"
      color-scheme="clustal2"
      label-width="100"
      highlight-color="orange"
    ></nightingale-msa>
  </nightingale-manager>
`;
LinksAndMSA.play = async () => {
  await customElements.whenDefined("nightingale-msa");
  const msa = document.getElementById("msa-3");
  if (msa) (msa as any).data = testSequences;
  await customElements.whenDefined("nightingale-links");
  const links = document.getElementById("links");
  if (links) (links as any).contacts = rawContactsHC;
};
