import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-interpro-track/src/index.ts";

import data from "../../packages/nightingale-interpro-track/tests/mockData/interpro-IPR016039.json";
import contributors from "../../packages/nightingale-interpro-track/tests/mockData/interpro-contributors.json";
import residues from "../../packages/nightingale-interpro-track/tests/mockData/interpro-residues.json";

export default {
  title: "Components/InterPro Track",
} as Meta;

const Template: Story<{
  width: number;
  height: number;
  length: number;
  "display-start": number;
  "display-end": number;
  highlight: string;
  layout: "non-overlapping" | "default";
}> = (args) => {
  const { width, height, length, highlight, layout } = args;
  return html`<nightingale-interpro-track
    id="track"
    width="${width}"
    height=${height}
    length="${length}"
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    highlight=${highlight}
    layout=${layout}
  ></nightingale-interpro-track>`;
};

export const Track = Template.bind({});
Track.args = {
  width: 500,
  height: 50,
  length: 100,
  "display-start": 1,
  "display-end": 50,
  highlight: "23:45",
  layout: "default",
};
Track.play = async () => {
  await customElements.whenDefined("nightingale-interpro-track");
  const track = document.getElementById("track");
  if (track) (track as any).data = data;
};

export const SimpleTrackNoControls = () => html`
  <h3>Entry</h3>
  <nightingale-interpro-track
    id="track1"
    width="600"
    length="390"
    displaystart="1"
    displayend="390"
    highlight="20:50,40:80"
    shape="roundRectangle"
  ></nightingale-interpro-track>
`;
SimpleTrackNoControls.play = async () => {
  await customElements.whenDefined("nightingale-interpro-track");
  const track1 = document.getElementById("track1");
  if (track1) {
    (track1 as any).data = data;
  }
};
export const TrackAndContributorsNoControls = () => html`
  <h3>Entry + contributors</h3>
  <nightingale-interpro-track
    id="track2"
    width="600"
    length="390"
    display-start="1"
    display-end="390"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;
TrackAndContributorsNoControls.play = async () => {
  await customElements.whenDefined("nightingale-interpro-track");
  const track2 = document.getElementById("track2");
  if (track2) {
    (track2 as any).data = data;
    (track2 as any).contributors = contributors;
  }
};
export const TrackWithResiduesNoControls = () => html`
  <h3>Entry + residues</h3>
  <nightingale-interpro-track
    id="track3"
    width="600"
    length="390"
    display-start="1"
    display-end="390"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;
TrackWithResiduesNoControls.play = async () => {
  await customElements.whenDefined("nightingale-interpro-track");
  const track3 = document.getElementById("track3");
  if (track3) {
    const dataCopy: Array<Record<string, unknown>> = data.map(
      ({ ...rest }) => ({ ...rest })
    );
    dataCopy[0].residues = residues;

    (track3 as any).data = dataCopy;
  }
};
export const TrackWithContributorsAndResiduesNoControls = () => html`
  <h3>Entry + contributors + residues</h3>
  <nightingale-interpro-track
    id="track4"
    width="600"
    length="390"
    display-start="1"
    display-end="390"
    highlight="20:50,40:80"
    shape="roundRectangle"
    expanded
  ></nightingale-interpro-track>
`;
TrackWithContributorsAndResiduesNoControls.play = async () => {
  await customElements.whenDefined("nightingale-interpro-track");
  const track4 = document.getElementById("track4");
  if (track4) {
    const contributorsCopy: Array<Record<string, unknown>> = contributors.map(
      ({ ...rest }) => ({ ...rest })
    );
    contributorsCopy[0].residues = residues;

    (track4 as any).data = data;
    (track4 as any).contributors = contributorsCopy;
  }
};
