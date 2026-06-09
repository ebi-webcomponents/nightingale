import { type ArgTypes, Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-distribution-track/src/index";
import { type DistributionData } from "../../packages/nightingale-distribution-track/src/nightingale-distribution-track";
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
};
type Args = typeof DefaultArgs;

const ArgumentTypes: Partial<ArgTypes<Args>> = {
  "highlight-event": { control: "select", options: ["onmouseover", "onclick"] },
  "y-min": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
  "y-max": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
};


const sampleSequence = "MALYGTHSHGLFKKLGIPGPTPLPFLGNILSYHKGFCMFDMECHKKYGKVWGFYDGQQPVLAITDPDMIKTVLVKECYSVFTNRRPFGPVGFMKSAISIA";

function prepareDistributionData(data: DistributionData[number]): DistributionData {
  return [
    {
      name: 'Data1',
      color: '#0088ff',
      positions: data.positions,
    },
    {
      name: 'Data2',
      color: '#ff8800',
      positions: data.positions.map(pos => ({ ...pos, values: pos.values.map(v => v * 0.9) })),
    },
  ];
}

function prepareLinegraphData(data: DistributionData) {
  const values = data[0].positions.map(pos => ({ position: pos.position, value: pos.values.reduce((a, b) => a + b, 0) / pos.values.length }));
  const bulgarianConstant = 10 / Math.max(...values.map(v => v.value));
  values.forEach(v => v.value *= bulgarianConstant); // I don't know how to set Y-range to linegraph track, this will do

  const chart1 = {
    name: "chart1",
    color: "#707070",
    fill: "#808080",
    lineCurve: "curveStep",
    range: [0, 10],
    values: values,
  };
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
        display-end="10"
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
        margin-bottom=20
        use-ctrl-to-zoom
        y-min=${args["y-min"]}
        y-max=${args["y-max"]}
        ?hide-outliers=${args["hide-outliers"]}
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
            ${nightingaleLinegraphTrack({ ...args, length: options.length, id: 0 })}
            ${nightingaleDistributionTrack({ ...args, length: options.length, id: 0 })}
          </div>
        </nightingale-manager>
      </div>`;
  }

  const story: Story<Args> = template.bind({});
  story.args = { ...DefaultArgs };
  story.argTypes = ArgumentTypes;
  const distributionData = prepareDistributionData(sampleDistributionData as any);
  const linegraphData = prepareLinegraphData(distributionData);

  story.play = async () => {
    await customElements.whenDefined("nightingale-linegraph-track");
    for (const track of document.getElementsByTagName("nightingale-linegraph-track")) {
      (track as any).data = linegraphData;
    }
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

// function processDistributionData(csvData: string): DistributionData {
//   console.log('csvData', csvData.length)
//   const lines = csvData.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
//   const header = lines[0].split(',').map(h => h.trim());
//   const unp_res_id = header.indexOf('unp_res_id');
//   const raw_score = header.indexOf('raw_score');
//   const grouped: { [unp_res_id: number]: number[] } = {};
//   for (let i = 1; i < lines.length; i++) {
//     const values = lines[i].split(',').map(v => v.trim());
//     const resId = parseInt(values[unp_res_id]);
//     const score = parseFloat(values[raw_score]);
//     (grouped[resId] ??= []).push(score);
//   }
//   const resIds = Object.keys(grouped).map(Number).sort((a, b) => a - b);
//   return {
//     positions: resIds.map(pos => ({
//       position: pos,
//       values: grouped[pos]
//     })),
//     index: [1, 2, 3],
//     probabilities: { 'A': [1, 1, 1] },
//   };
// }
