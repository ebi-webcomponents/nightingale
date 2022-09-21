import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";
import "../../packages/nightingale-track/src/index.ts";
import "../../packages/nightingale-sequence/src/index.ts";
import "../../packages/nightingale-coloured-sequence/src/index.ts";
import "../../packages/nightingale-interpro-track/src/index.ts";

import iproData from "../../packages/nightingale-interpro-track/tests/mockData/interpro-IPR016039.json";
import contributors from "../../packages/nightingale-interpro-track/tests/mockData/interpro-contributors.json";
import residues from "../../packages/nightingale-interpro-track/tests/mockData/interpro-residues.json";

export default {
  title: "Components/Manager",
} as Meta;

const defaultSequence =
  "iubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASViubcbcIUENACBPAOUBCASFUBRUABBRWOAUVBISVBAISBVDOASVCASFU";
const defaultData = [
  {
    accession: "feature1",
    start: 1,
    end: 2,
    color: "blue",
  },
  {
    accession: "feature1",
    start: 49,
    end: 50,
    color: "red",
  },
  {
    accession: "feature1",
    start: 10,
    end: 20,
    color: "#342ea2",
  },
  {
    accession: "feature2",
    locations: [{ fragments: [{ start: 30, end: 45 }] }],
    color: "#A42ea2",
  },
  {
    accession: "feature3",
    locations: [
      {
        fragments: [{ start: 15, end: 15 }],
      },
      { fragments: [{ start: 18, end: 18 }] },
    ],
    color: "#A4Aea2",
  },
  {
    accession: "feature4",
    locations: [
      {
        fragments: [
          { start: 20, end: 23 },
          { start: 26, end: 32 },
        ],
      },
    ],
  },
];

const Template: Story<{
  width: number;
  height: number;
  length: number;
  "display-start": number;
  "display-end": number;
  highlight: string;
  sequence: string;
  "highlight-color": string;
  "margin-color": string;
}> = (args) => {
  const { width, height, length, sequence } = args;
  return html`
    <nightingale-manager>
      <div style="line-height: 0">
        <nightingale-navigation
          id="navigation"
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
          show-highlight
        >
        </nightingale-navigation>
      </div>
      <div style="line-height: 0">
        <nightingale-sequence
          id="sequence"
          sequence=${sequence}
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
        >
        </nightingale-sequence>
      </div>
      <div style="line-height: 0">
        <nightingale-coloured-sequence
          id="sequence"
          sequence=${sequence}
          width="${width}"
          height="10"
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
          scale="hydrophobicity-scale"
        >
        </nightingale-coloured-sequence>
      </div>
      <div style="line-height: 0">
        <nightingale-track
          id="track"
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
        >
        </nightingale-track>
      </div>
      <div style="line-height: 0">
        <nightingale-track
          id="track2"
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
          layout="non-overlapping"
        >
        </nightingale-track>
      </div>
      <div style="line-height: 0">
        <nightingale-interpro-track
          id="trackIpro"
          width="${width}"
          height=${height}
          length="${length}"
          display-start="${args["display-start"]}"
          display-end="${args["display-end"]}"
          highlight-event="onmouseover"
          highlight-color=${args["highlight-color"]}
          margin-color=${args["margin-color"]}
          shape="roundRectangle"
          expanded
        >
        </nightingale-interpro-track>
      </div>
    </nightingale-manager>
  `;
};

export const Manager = Template.bind({});
Manager.args = {
  width: 800,
  height: 50,
  length: defaultSequence.length,
  sequence: defaultSequence,
  "display-start": 10,
  "display-end": 80,
  "highlight-color": "#EB3BFF22",
  "margin-color": "transparent",
};
Manager.play = async () => {
  await customElements.whenDefined("nightingale-sequence");
  const sequence = document.getElementById("sequence");
  if (sequence) (sequence as any).fixedHighlight = "10:20";

  await customElements.whenDefined("nightingale-navigation");
  const nav = document.getElementById("navigation");
  if (nav) (nav as any).fixedHighlight = "10:20";
  await customElements.whenDefined("nightingale-track");
  const track = document.getElementById("track");
  if (track) {
    (track as any).fixedHighlight = "10:20";
    (track as any).data = defaultData;
  }
  const track2 = document.getElementById("track2");
  if (track2) {
    (track2 as any).fixedHighlight = "10:20";
    (track2 as any).data = defaultData;
  }
  const trackIpro = document.getElementById("trackIpro");
  if (trackIpro) {
    (trackIpro as any).fixedHighlight = "10:20";
    (trackIpro as any).data = iproData;
    (contributors[0] as any).residues = residues;
    (trackIpro as any).contributors = contributors;
  }
};
