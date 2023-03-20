import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-linegraph-track/src/index.ts";

export default {
  title: "Components/Tracks/Linegraph Track",
} as Meta;

import tinyData from "../../packages/nightingale-linegraph-track/tests/mockData/data.json";
import data from "../../packages/nightingale-linegraph-track/tests/mockData/line-graph-chart.json";

export const LinegraphWithoutControls = () => html`
  <h3>Linegraph</h3>
  <h3>1 line with 5 points(1 to 5)</h3>
  <nightingale-linegraph-track
    id="track"
    length="5"
  ></nightingale-linegraph-track>
  <h3>2 lines with 20 points(41 to 65)</h3>
  <nightingale-linegraph-track
    id="track1"
    width="800"
    height="200"
    length="65"
    display-start="40"
    display-end="65"
  ></nightingale-linegraph-track>
`;

LinegraphWithoutControls.play = async () => {
  await customElements.whenDefined("nightingale-linegraph-track");
  const track = document.getElementById("track");
  if (track) {
    (track as any).data = tinyData;
  }
  const track1 = document.getElementById("track1");
  if (track1) {
    (track1 as any).data = data;
  }
};
