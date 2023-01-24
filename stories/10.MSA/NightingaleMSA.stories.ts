import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-msa/src/index.ts";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";

import { defaultSchemes } from "../../packages/nightingale-msa/src/colorschemes";

export default {
  title: "Components/Other/Alignments",
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
      "1XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII----XAVOURSSSAASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBSIUNFDIOSFJIPDSNFJPOSJFIJII",
  },
  {
    name: "seq2",
    sequence:
      "2XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXX-XAVO-RSS-FASUICABDUFBSODUNVISDONOINDOINOIADFNOIOFDIOFNOIANFBS-UNFDIOSFJIPDSNFJPOSJFIJIIXXX",
  },
  {
    name: "seq3",
    sequence:
      "3XAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJIIssssXAVOURSSSFASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIOFNOAANFBSIUNFDIOSFJIP--NFJPOSJFIJII",
  },
  {
    name: "seq4",
    sequence:
      "4XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXX-XAVO-RSS-FASUICABDUF-SODUNVISDONOINDOINOIADFNOIOFDIAANOIANFBSIUNFDIOSFJIPDSNF--OSJFIJIIXXX",
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
  if (msa) (msa as any).data = testSequences;
};

export const MinimaNightingaleMSA = () => html`
  <nightingale-manager>
    <nightingale-navigation
      height="50"
      width="600"
      length="180"
      id="navigation"
    ></nightingale-navigation>

    <nightingale-msa
      id="msa-2"
      height="200"
      width="600"
      color-scheme="clustal"
      display-start="1"
      display-end="90"
    ></nightingale-msa>
  </nightingale-manager>
`;
MinimaNightingaleMSA.play = async () => {
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
