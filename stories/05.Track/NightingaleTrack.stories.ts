import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-track/src/index.ts";
import mockData from "../../packages/nightingale-track/tests/mockData/data.json";

export default {
  title: "Components/NightingaleTrack",
} as Meta;

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
  "margin-top": number;
  highlight: string;
  layout: "non-overlapping" | "default";
}> = (args) => {
  const { width, height, length, highlight, layout } = args;
  return html`<nightingale-track
    id="track"
    width="${width}"
    height=${height}
    length="${length}"
    display-start=${args["display-start"]}
    display-end=${args["display-end"]}
    margin-top=${args["margin-top"]}
    highlight=${highlight}
    layout=${layout}
  ></nightingale-track>`;
};

export const Track = Template.bind({});
Track.args = {
  width: 500,
  height: 50,
  length: 100,
  "margin-top": 1,
  "display-start": 1,
  "display-end": 50,
  highlight: "23:45",
  layout: "default",
};
Track.play = async () => {
  await customElements.whenDefined("nightingale-track");
  const track = document.getElementById("track");
  if (track) (track as any).data = defaultData;
};

export const TrackWithSymbols = Template.bind({});
TrackWithSymbols.args = {
  ...Track.args,
  height: 500,
  layout: "non-overlapping",
};
TrackWithSymbols.play = async () => {
  await customElements.whenDefined("nightingale-track");
  const track = document.getElementById("track");
  if (track) (track as any).data = mockData;
};

export const TrackNoControls = () => html`
  <nightingale-track
    id="track"
    length="223"
    height="100"
    display-start="1"
    display-end="50"
    layout="non-overlapping"
  ></nightingale-track>
`;
TrackNoControls.play = async () => {
  await customElements.whenDefined("nightingale-track");
  const track = document.getElementById("track");
  if (track) (track as any).data = defaultData;
};
