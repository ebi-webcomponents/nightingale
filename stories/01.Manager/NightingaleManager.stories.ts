import { Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-navigation/src/index.ts";
import "../../packages/nightingale-manager/src/index.ts";
import "../../packages/nightingale-track/src/index.ts";
import "../../packages/nightingale-sequence/src/index.ts";
import "../../packages/nightingale-colored-sequence/src/index.ts";
import "../../packages/nightingale-interpro-track/src/index.ts";
import "../../packages/nightingale-saver/src/index.ts";
import "../../packages/nightingale-overlay/src/index.ts";
import "../../packages/nightingale-structure/src/index.ts";

import iproData from "../../packages/nightingale-interpro-track/tests/mockData/interpro-IPR016039.json";
import contributors from "../../packages/nightingale-interpro-track/tests/mockData/interpro-contributors.json";
import residues from "../../packages/nightingale-interpro-track/tests/mockData/interpro-residues.json";
import linegraph from "../../packages/nightingale-linegraph-track/tests/mockData/line-graph-chart.json";

export default {
  title: "Components/Manager",
} as Meta;

const defaultSequence =
  "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDSDPSGTKTCIDTKEGILQYCQEVYPELQITNVVEANQPVTIQNWCKRGRKQCKTHPHFVIPYRCLVGEFVSDALLVPDKCKFLHQERMDVCETHLHWHTVAKETCSEKSTNLHDYGMLLPCGIDKFRGVEFVCCPLAEESDNVDSADAEEDDSDVWWGGADTDYADGSEDKVVEVAEEEEVAEVEEEEADDDEDDEDGDEVEEEAEEPYEEATERTTSIATTTTTTTESVEEVVREVCSEQAETGPCRAMISRWYFDVTEGKCAPFFYGGCGGNRNNFDTEEYCMAVCGSAMSQSLLKTTQEPLARDPVKLPTTAASTPDAVDKYLETPGDENEHAHFQKAKERLEAKHRERMSQVMREWEEAERQAKNLPKADKKAVIQHFQEKVESLEQEAANERQQLVETHMARVEAMLNDRRRLALENYITALQAVPPRPRHVFNMLKKYVRAEQKDRQHTLKHFEHVRMVDPKKAAQIRSQVMTHLRVIYERMNQSLSLLYNVPAVAEEIQDEVDELLQKEQNYSDDVLANMISEPRISYGNDALMPSLTETKTTVELLPVNGEFSLDDLQPWHSFGADSVPANTENEVEPVDARPAADRGLTTRPGSGLTNIKTEEISEVKMDAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIATVIVITLVMLKKKQYTSIHHGVVEVDAAVTPEERHLSKMQQNGYENPTYKFFEQMQN";
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
  "min-width": number;
  height: number;
  length: number;
  "display-start": number;
  "display-end": number;
  highlight: string;
  sequence: string;
  "highlight-color": string;
  "margin-color": string;
  useOverlay: boolean;
  "heatmap-id": string;
  "heatmap-height": number;
}> = (args) => {
  const { height, length, sequence, useOverlay } = args;
  return html`
    ${useOverlay &&
    html`<nightingale-overlay for="root"></nightingale-overlay>`}
    <nightingale-saver
      element-id="root"
      background-color="white"
      scale-factor="2"
    ></nightingale-saver>
    <div id="root">
      <nightingale-manager>
        <div style="display:flex; flex-direction: column;    width: 100%;">
          <div style="line-height: 0">
            <nightingale-navigation
              id="navigation"
              min-width="${args["min-width"]}"
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
              min-width="${args["min-width"]}"
              height=${height}
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              use-ctrl-to-zoom
            >
            </nightingale-sequence>
          </div>
          <div style="line-height: 0">
            <nightingale-colored-sequence
              id="sequence"
              sequence=${sequence}
              min-width="${args["min-width"]}"
              height="10"
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              scale="hydrophobicity-scale"
              use-ctrl-to-zoom
            >
            </nightingale-colored-sequence>
          </div>
          <div style="line-height: 0">
            <nightingale-track
              id="track"
              min-width="${args["min-width"]}"
              height=${height}
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              use-ctrl-to-zoom
            >
            </nightingale-track>
          </div>
          <div style="line-height: 0">
            <nightingale-track
              id="track2"
              min-width="${args["min-width"]}"
              height=${height}
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              layout="non-overlapping"
              use-ctrl-to-zoom
            >
            </nightingale-track>
          </div>
          <div style="line-height: 0">
            <nightingale-interpro-track
              id="trackIpro"
              min-width="${args["min-width"]}"
              height=${height}
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              shape="roundRectangle"
              label=".feature.name"
              use-ctrl-to-zoom
              show-label
              expanded
            >
            </nightingale-interpro-track>
          </div>
          <div style="line-height: 0">
            <nightingale-sequence-heatmap
              id="sequence-heatmap"
              heatmap-id=${args["heatmap-id"]}
              min-width="${args["min-width"]}"
              length="${length}"
              height=${args["heatmap-height"]}
              display-start=${args["display-start"]}
              display-end=${args["display-end"]}
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              use-ctrl-to-zoom
            ></nightingale-sequence-heatmap>
          </div>
          <div style="line-height: 0">
            <nightingale-linegraph-track
              id="linegraph"
              min-width="${args["min-width"]}"
              height=${height}
              length="${length}"
              display-start="${args["display-start"]}"
              display-end="${args["display-end"]}"
              highlight-event="onmouseover"
              highlight-color=${args["highlight-color"]}
              margin-color=${args["margin-color"]}
              use-ctrl-to-zoom
            ></nightingale-linegraph-track>
          </div>
          <nightingale-structure
            protein-accession="P05067"
            structure-id="1AAP"
          ></nightingale-structure>
        </div>
      </nightingale-manager>
    </div>
  `;
};

export const AllTracks = Template.bind({});
AllTracks.args = {
  "min-width": 500,
  height: 50,
  length: defaultSequence.length,
  sequence: defaultSequence,
  "display-start": 10,
  "display-end": 80,
  "highlight-color": "#EB3BFF22",
  "margin-color": "transparent",
  useOverlay: true,
  "heatmap-id": "id1",
  "heatmap-height": 180,
};
AllTracks.play = async () => {
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
  const linegraphTrack = document.getElementById("linegraph");
  if (linegraphTrack) {
    (linegraphTrack as any).data = linegraph;
  }

  await customElements.whenDefined("nightingale-sequence-heatmap");
  const seqHeatmap = document.getElementById("sequence-heatmap");
  if (seqHeatmap) {
    setTimeout(() => {
      // wait until renders finished
      (seqHeatmap as any).fixedHighlight = "10:20";
      (seqHeatmap as any).createRandomFromLength();
    }, 50);
  }
};

export const SequenceNoControls = () =>
  html`<h3>Manger with only navigation and sequence</h3>
    <nightingale-manager>
      <div style="line-height: 0">
        <nightingale-navigation
          id="navigation"
          height="100"
          width="800"
          length=${defaultSequence.length}
          highlight-color="#EB3BFF22"
          show-highlight
        >
        </nightingale-navigation>
      </div>
      <div style="line-height: 0">
        <nightingale-sequence
          sequence=${defaultSequence}
          height="40"
          width="800"
          length=${defaultSequence.length}
        ></nightingale-sequence>
      </div>
    </nightingale-manager> `;

export const TrackNoControls = () =>
  html`<h3>Manger with only navigation and track</h3>
    <nightingale-manager>
      <div style="line-height: 0">
        <nightingale-navigation
          id="navigation"
          height="100"
          width="800"
          length="60"
          highlight-color="#EB3BFF22"
          show-highlight
        >
        </nightingale-navigation>
      </div>
      <div style="line-height: 0">
        <nightingale-track
          id="track-simple"
          width="800"
          length="60"
          use-ctrl-to-zoom
        >
        </nightingale-track>
      </div>
    </nightingale-manager> `;
TrackNoControls.play = async () => {
  await customElements.whenDefined("nightingale-track");
  const track = document.getElementById("track-simple");
  if (track) {
    (track as any).fixedHighlight = "10:20";
    (track as any).data = defaultData;
  }
};

export const InterproTrackNoControls = () =>
  html`<h3>Manger with only navigation and InterPro track</h3>
    <nightingale-manager>
      <div style="line-height: 0">
        <nightingale-navigation
          id="navigation"
          height="100"
          width="800"
          length="60"
          highlight-color="#EB3BFF22"
          show-highlight
        >
        </nightingale-navigation>
      </div>
      <div style="line-height: 0">
        <nightingale-sequence
          sequence=${defaultSequence}
          height="40"
          width="800"
          length=${defaultSequence.length}
        ></nightingale-sequence>
      </div>
      <div style="line-height: 0">
        <nightingale-interpro-track
          id="interpro"
          width="800"
          length="60"
          shape="roundRectangle"
          label=".feature.name"
          use-ctrl-to-zoom
          show-label
          expanded
          highlight-event="onmouseover"
        >
        </nightingale-interpro-track>
      </div>
    </nightingale-manager> `;
InterproTrackNoControls.play = async () => {
  const trackIpro = document.getElementById("interpro");
  if (trackIpro) {
    (trackIpro as any).fixedHighlight = "10:20";
    (trackIpro as any).data = iproData;
    (contributors[0] as any).residues = residues;
    (trackIpro as any).contributors = contributors;
  }
};
