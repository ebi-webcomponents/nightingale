import { type ArgTypes, Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-distribution-track/src/index";
import { type DistributionData, ZoomedOutRangeOptions } from "../../packages/nightingale-distribution-track/src/nightingale-distribution-track";
import sampleDistributionData from "../../packages/nightingale-distribution-track/tests/mockData/sample-1.json";


export default { title: "Components/Tracks/Distribution Track" } as Meta;


const DefaultArgs = {
  "min-width": 400,
  "height": 200,
  "highlight-event": "onmouseover",
  "highlight-color": "#EB3BFF22",
  "margin-color": "#ffffffdd",
  "y-min": 0 as number | undefined,
  "y-max": undefined as number | undefined,
  "hide-outliers": false,
  "zoomed-out-range": 'whiskers',
};
type Args = typeof DefaultArgs;

const ArgumentTypes: Partial<ArgTypes<Args>> = {
  "highlight-event": { control: "select", options: ["onmouseover", "onclick"] },
  "y-min": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
  "y-max": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
  "zoomed-out-range": { control: "select", options: ZoomedOutRangeOptions },
};


// const nDataRepeat = 20_000;
const nDataRepeat = 1_000;
// const nDataRepeat = 81;
// const nDataRepeat = 82;
// Around 100k datapoints (nDataRepeat=1000), canvas draw takes > 40ms
// Around 400k datapoints (nDataRepeat=4000), aliasing makes data invisible (causes artifacts even before)

const sampleSequence = "MALYGTHSHGLFKKLGIPGPTPLPFLGNILSYHKGFCMFDMECHKKYGKVWGFYDGQQPVLAITDPDMIKTVLVKECYSVFTNRRPFGPVGFMKSAISIA".repeat(nDataRepeat);

function prepareDistributionData(data: DistributionData[number]): DistributionData {
  console.time('prepareDistributionData')
  // const positions = data.positions.slice();
  const positions = data.positions.map(pos => ({ position: pos.position, values: pos.values.sort() }));
  const shift = data.positions.length;
  for (let i = 1; i < nDataRepeat; i++) {
    for (const pos of data.positions) {
      positions.push({ position: pos.position + i * shift, values: pos.values });
    }
  }
  console.timeEnd('prepareDistributionData')

  return [
    {
      name: 'Data1',
      color: '#0088ff',
      positions: positions,
      // positions: remove(positions, 3, 4, 5, 6, 35), // DEBUG
      // positions: remove(positions, 3, 4, 5, 6,
      //   ...new Array(50).fill(0).map((_, i) => 35 + i),
      //   ...new Array(500).fill(0).map((_, i) => 500 + i),
      //   ...new Array(5000).fill(0).map((_, i) => 5000 + i),
      // ), // DEBUG
    },
    // {
    //   name: 'Data2',
    //   color: '#ff8800',
    //   // positions: positions.map(pos => ({ ...pos, values: pos.values.map(v => v * 0.8) })),
    //   positions: remove(positions.map(pos => ({ ...pos, values: pos.values.map(v => v * 0.8) })), 1, 7), // DEBUG
    // },
  ];
}

function remove<T>(arr: T[], ...indices: number[]) {
  const out = arr.slice();
  for (const i of indices.sort((a, b) => b - a)) {
    out.splice(i, 1);
  }
  return out;
}

function prepareLinegraphData(data: DistributionData) {
  console.time('prepareLinegraphData')
  const values = data[0].positions.map(pos => ({ position: pos.position, value: pos.values.reduce((a, b) => a + b, 0) / pos.values.length }));
  const max = values.reduce((old, v) => v.value > old ? v.value : old, 0);

  const chart1 = {
    name: "chart1",
    color: "#707070",
    fill: "#808080",
    lineCurve: "curveStep",
    range: [0, max],
    values: values,
  };
  console.timeEnd('prepareLinegraphData')
  return [chart1];
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
        show-highlight 
        display-end="100"
      >
      </nightingale-navigation>
    </div>`;
}

function nightingaleSequence(args: Args & { length: number }) {
  const sequence = sampleSequence;
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
        use-ctrl-to-zoom
      >
      </nightingale-sequence>
    </div>`;
}

function nightingaleLinegraphTrack(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">Linegraph</div>
      <nightingale-linegraph-track
        id="track-linegraph-${args["id"]}"
        min-width="${args["min-width"]}"
        height="44"
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        ?highlight-on-click="${args["highlight-event"] === "onclick"}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        use-ctrl-to-zoom
      >
        <style>.mouse-over-effects { opacity: 0; }</style>
      </nightingale-linegraph-track>
    </div>`;
}

function nightingaleDistributionTrack(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">Distribution</div>
      <nightingale-distribution-track
        id="track-distribution-${args["id"]}"
        min-width="${args["min-width"]}"
        height=${args["height"]}
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        margin-top=10
        margin-bottom=10
        use-ctrl-to-zoom
        y-min=${args["y-min"]}
        y-max=${args["y-max"]}
        ?hide-outliers=${args["hide-outliers"]}
        zoomed-out-range=${args["zoomed-out-range"]}
      >
      </nightingale-distribution-track>
    </div>`;
}


function makeStory(options: { length: number }): Story<Args> {
  const template: Story<Args> = (args: Args) => {
    return html`
      <nightingale-saver element-id="nightingale-root" background-color="white" scale-factor="2"></nightingale-saver>
      <span>Use Ctrl+scroll to zoom.</span>
      <div id="nightingale-root">
        <style>
          .row { line-height: 0; margin-top: 2px; display: flex; align-items: center; }
          .label { width: 75px; line-height: initial; font-size: 0.8rem; text-align: center; overflow: hidden; }
        </style>
        <nightingale-manager>
          <div style="display:flex; flex-direction: column; width: 100%;">
            ${nightingaleNavigation({ ...args, length: options.length })}
            ${nightingaleSequence({ ...args, length: options.length })}
            <!--${nightingaleLinegraphTrack({ ...args, length: options.length, id: 0 })}-->
            ${nightingaleDistributionTrack({ ...args, length: options.length, id: 0 })}
          </div>
        </nightingale-manager>
      </div>`;
  }

  const story: Story<Args> = template.bind({});
  story.args = { ...DefaultArgs };
  story.argTypes = ArgumentTypes;
  const distributionData = prepareDistributionData(sampleDistributionData as any);
  // const linegraphData = prepareLinegraphData(distributionData);

  story.play = async () => {
    // await customElements.whenDefined("nightingale-linegraph-track");
    // for (const track of document.getElementsByTagName("nightingale-linegraph-track")) {
    //   (track as any).data = linegraphData;
    // }
    await customElements.whenDefined("nightingale-distribution-track");
    for (const track of document.getElementsByTagName("nightingale-distribution-track")) {
      (track as any).data = distributionData;
    }
  };
  return story;
}


export const LinegraphAndDistribution = makeStory({
  length: sampleSequence.length,
});
