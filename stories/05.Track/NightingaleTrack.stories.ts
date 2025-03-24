import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import { range } from "lodash-es";
import "../../packages/nightingale-track/src/index.ts";
import mockData from "../../packages/nightingale-track/tests/mockData/data.json";

export default {
  title: "Components/Tracks/NightingaleTrack",
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
  "display-end": 100,
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


const LayoutsTemplate: Story<{
  "width": number;
  "height": number;
  "margin-top": number;
  "margin-bottom": number;
  "margin-left": number;
  "margin-right": number;
  "margin-color": string;
  "length": number;
  "display-start": number;
  "display-end": number;
}> = (args) => {
  function makeTrack(id: string, layout: "non-overlapping" | "default") {
    return html`<div>
      <nightingale-track style="border: solid 1px gainsboro;"
        id="${id}"
        width="${args["width"]}"
        height=${args["height"]}
        margin-top=${args["margin-top"]}
        margin-bottom=${args["margin-bottom"]}
        margin-left=${args["margin-left"]}
        margin-right=${args["margin-right"]}
        margin-color=${args["margin-color"]}
        length="${args["length"]}"
        display-start=${args["display-start"]}
        display-end=${args["display-end"]}
        layout="${layout}"
      ></nightingale-track>
    </div>`;
  }
  return html`
    <h3>DefaultLayout</h3>
    ${makeTrack("track-default-1", "default")}
    ${makeTrack("track-default-2", "default")}
    ${makeTrack("track-default-3", "default")}
    <h3>NonOverlappingLayout</h3>
    ${makeTrack("track-non-overlapping-1", "non-overlapping")}
    ${makeTrack("track-non-overlapping-2", "non-overlapping")}
    ${makeTrack("track-non-overlapping-3", "non-overlapping")}
  `;
};

export const Layouts = LayoutsTemplate.bind({});
Layouts.args = {
  "width": 500,
  "height": 50,
  "margin-top": 0,
  "margin-bottom": 0,
  "margin-left": 10,
  "margin-right": 10,
  "margin-color": "transparent",
  "length": 50,
  "display-start": 1,
  "display-end": 50,
};
Layouts.play = async () => {
  await customElements.whenDefined("nightingale-track");
  const data1 = defaultData.map(d => ({ ...d, fill: d.color ?? "gray", color: "black" }));
  const data2 = [{ accession: `feature0`, start: 1, end: 50, fill: "#7570b3", color: "#524E7D" }];
  const data3 = range(10).map((_, i) => ({
    accession: `feature${i}`,
    start: 1 + (i % 10),
    end: 41 + (i % 10),
    fill: i % 2 ? "#1B9E77" : "#d95f02",
    color: i % 2 ? "#136F53" : "#984301",
  }));
  function setData(trackId: string, data: any) {
    const track = document.getElementById(trackId);
    if (track) (track as any).data = data;
  }
  setData("track-default-1", data1);
  setData("track-default-2", data2);
  setData("track-default-3", data3);
  setData("track-non-overlapping-1", data1);
  setData("track-non-overlapping-2", data2);
  setData("track-non-overlapping-3", data3);
};
