import { Meta, Story } from "@storybook/web-components";
import { range, rgb } from "d3";
import { html } from "lit-html";
import "../../packages/nightingale-track-canvas/src/index";


export default { title: "Components/Tracks/NightingaleTrack-Canvas" } as Meta;


const DefaultArgs = {
  "min-width": 400,
  "height": 24,
  "highlight-event": "onmouseover", // "onmouseover"|"onclick"
  "highlight-color": "#EB3BFF22",
  "margin-color": "#ffffffdd", // "transparent"
  "margin-left": "10",
  "margin-right": "10",
  "layout": "non-overlapping", // "default"|"non-overlapping"
};
type Args = typeof DefaultArgs;


const sampleSequence = "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDSDPSGT";

/** Create a sequence of given `length` */
function makeSequence(length: number) {
  const n = Math.ceil(length / sampleSequence.length);
  return range(n).map(() => sampleSequence).join("").slice(0, length);
}


const Colors = ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"];
const Shapes = [
  "rectangle", "roundRectangle", "line", "bridge",
  "discontinuosEnd", "discontinuos", "discontinuosStart",
  "helix", "strand",
  "circle", "triangle", "diamond", "pentagon", "hexagon",
  "chevron", "catFace", "arrow", "wave", "doubleBar",
];

const defaultData = [
  {
    accession: "feature1",
    start: 1,
    end: 2,
    color: "pink",
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
    color: "#F0E68C",
    residuesToHighlight: [{
      position: 5,
    }]
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

/** Create dummy data with one feature per residue */
function makeResidueData(start: number, end: number) {
  return makeSpanData(start, end, 1, 0);
}

/** Create dummy data with one feature per a span of residues (e.g. 1-10, 11-20, 21-30...) */
function makeSpanData(start: number, end: number, spanLength: number = 10, gapLength: number = 0) {
  return range(start, end + 1, spanLength + gapLength).map((start_, i) => ({
    accession: `feature${i}`,
    tooltipContent: `feature${i}`,
    start: start_,
    end: start_ + spanLength - 1,
    color: rgb(Colors[i % Colors.length]).darker().toString(),
    fill: Colors[i % Colors.length],
    shape: Shapes[i % Shapes.length],
    opacity: 0.9,
  }));
}


function nightingaleNavigation(args: Args & { length: number }) {
  return html`
    <div class="row">
      <div class="label"></div>
      <nightingale-navigation
        id="navigation"
        min-width="${args["min-width"]}"
        height="50"
        length="${args["length"]}"
        highlight-color=${args["highlight-color"]}
        margin-color=${args["margin-color"]}
        margin-left=${args["margin-left"]}
        margin-right=${args["margin-right"]}
        show-highlight
      >
      </nightingale-navigation>
    </div>`;
}

function nightingaleSequence(args: Args & { length: number }) {
  const sequence = makeSequence(args["length"]);
  return html`
    <div class="row">
      <div class="label"></div>
      <nightingale-sequence
        id="sequence"
        sequence=${sequence}
        min-width="${args["min-width"]}"
        height="30"
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color=${args["highlight-color"]}
        margin-color=${args["margin-color"]}
        margin-left=${args["margin-left"]}
        margin-right=${args["margin-right"]}
        use-ctrl-to-zoom
      >
      </nightingale-sequence>
    </div>`;
}

function nightingaleTrack(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">SVG</div>
      <nightingale-track
        id="track-${args["id"]}"
        min-width="${args["min-width"]}"
        height=${args["height"]}
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        margin-left=${args["margin-left"]}
        margin-right=${args["margin-right"]}
        use-ctrl-to-zoom
        layout="${args["layout"]}"
      >
      </nightingale-track>
    </div>`;
}

function nightingaleTrackCanvas(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">Canvas</div>
      <nightingale-track-canvas
        id="canvas-track-${args["id"]}"
        min-width="${args["min-width"]}"
        height=${args["height"]}
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        margin-left=${args["margin-left"]}
        margin-right=${args["margin-right"]}
        use-ctrl-to-zoom
        layout="${args["layout"]}"
      >
      </nightingale-track-canvas>
    </div>`;
}


function makeStory(options: { nTracks: number, showNightingaleTrack: boolean, showNightingaleTrackCanvas: boolean, length: number, data: any[] }): Story<Args> {
  const template: Story<Args> = (args: Args) => {
    const tracks = range(options.nTracks).map(i => html`
      ${options.showNightingaleTrack ? nightingaleTrack({ ...args, length: options.length, id: i }) : undefined}
      ${options.showNightingaleTrackCanvas ? nightingaleTrackCanvas({ ...args, length: options.length, id: i }) : undefined}
    `);
    return html`
      <nightingale-saver element-id="nightingale-root" background-color="white" scale-factor="2"></nightingale-saver>
      <span>Use Ctrl+scroll to zoom.</span>
      <div id="nightingale-root">
        <style>
          .row { line-height: 0; margin-top: 2px; display: flex; align-items: center; }
          .label { width: 40px; line-height: initial; font-size: 0.8rem; text-align: center; overflow: hidden; }
        </style>
        <nightingale-manager>
          <div style="display:flex; flex-direction: column; width: 100%;">
            ${nightingaleNavigation({ ...args, length: options.length })}
            ${nightingaleSequence({ ...args, length: options.length })}
            ${tracks}
          </div>
        </nightingale-manager>
      </div>`;
  }

  const story: Story<Args> = template.bind({});
  story.args = { ...DefaultArgs };
  story.play = async () => {
    await customElements.whenDefined("nightingale-track");
    for (const track of document.getElementsByTagName("nightingale-track")) {
      (track as any).data = options.data;
    }
    await customElements.whenDefined("nightingale-track-canvas");
    for (const track of document.getElementsByTagName("nightingale-track-canvas")) {
      (track as any).data = options.data;
    }
  };
  return story;
}


export const Track = makeStory({
  nTracks: 1,
  showNightingaleTrack: true,
  showNightingaleTrackCanvas: true,
  length: 60,
  data: defaultData,
});

export const AllShapes = makeStory({
  nTracks: 1,
  showNightingaleTrack: true,
  showNightingaleTrackCanvas: true,
  length: 400,
  data: [...makeResidueData(1, 100), ...makeSpanData(121, 400)],
});

export const BigData = makeStory({
  nTracks: 50,
  showNightingaleTrack: false,
  showNightingaleTrackCanvas: true,
  length: 5000,
  data: makeResidueData(1, 5000),
});
