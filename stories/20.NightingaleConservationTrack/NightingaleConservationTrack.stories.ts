import { type ArgTypes, Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-conservation-track/src/index";
import { type SequenceConservationData } from "../../packages/nightingale-conservation-track/src/nightingale-conservation-track";
import sampleConservationData from "../../packages/nightingale-conservation-track/tests/mockData/sample-conservation-data.json";


export default { title: "Components/Tracks/Conservation Track" } as Meta;


const DefaultArgs = {
  "letter-order": "default",
  "min-width": 400,
  "height": 200,
  "highlight-event": "onmouseover",
  "highlight-color": "#EB3BFF22",
  "margin-color": "#ffffffdd",
};
type Args = typeof DefaultArgs;

const ArgumentTypes: Partial<ArgTypes<Args>> = {
  "highlight-event": { control: "select", options: ["onmouseover", "onclick"] },
  "letter-order": { control: "select", options: ["default", "probability"] },
};


const sampleSequence = "MALYGTHSHGLFKKLGIPGPTPLPFLGNILSYHKGFCMFDMECHKKYGKVWGFYDGQQPVLAITDPDMIKTVLVKECYSVFTNRRPFGPVGFMKSAISIAEDEEWKRLRSLLSPTFTSGKLKEMVPIIAQYGDVLVRNLRREAETGKPVTLKDVFGAYSMDVITSTSFGVNIDSLNNPQDPFVENTKKLLRFDFLDPFFLSITVFPFLIPILEVLNICVFPREVTNFLRKSVKRMKESRLEDTQKHRVDFLQLMIDSQNSKETESHKALSDLELVAQSIIFIFAGYETTSSVLSFIMYELATHPDVQQKLQEEIDAVLPNKAPPTYDTVLQMEYLDMVVNETLRLFPIAMRLERVCKKDVEINGMFIPKGVVVMIPSYALHRDPKYWTEPEKFLPERFSKKNKDNIDPYIYTPFGSGPRNCIGMRFALMNMKLALIRVLQNFSFKPCKETQIPLKLSLGGLLQPEKPVVLKVESRDGTVSGAHHHH";

function prepareConservationData(data: typeof sampleConservationData): SequenceConservationData {
  const out: SequenceConservationData = {
    index: data.data.index,
    probabilities: {},
  };
  for (const field in data.data) {
    if (data.data.hasOwnProperty(field) && field.startsWith('probability_')) {
      const letter = field.slice('probability_'.length);
      out.probabilities[letter] = data.data[field as keyof typeof data.data];
    }
  }
  return out;
}

function prepareLinegraphData(data: typeof sampleConservationData) {
  const chart1 = {
    name: "chart1",
    color: "#707070",
    fill: "#808080",
    lineCurve: "curveStep",
    range: [0, 10],
    values: data.data.index.map((position, i) => ({ position, value: data.data.conservation_score[i] })),
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

function nightingaleConservationTrack(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">Conservation</div>
      <nightingale-conservation-track
        id="track-conservation-${args["id"]}"
        min-width="${args["min-width"]}"
        height=${args["height"]}
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        margin-top=10
        margin-bottom=20
        use-ctrl-to-zoom
        letter-order=${args["letter-order"]}
      >
      </nightingale-conservation-track>
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
            ${nightingaleConservationTrack({ ...args, length: options.length, id: 0 })}
          </div>
        </nightingale-manager>
      </div>`;
  }

  const story: Story<Args> = template.bind({});
  story.args = { ...DefaultArgs };
  story.argTypes = ArgumentTypes;
  story.play = async () => {
    await customElements.whenDefined("nightingale-linegraph-track");
    for (const track of document.getElementsByTagName("nightingale-linegraph-track")) {
      (track as any).data = prepareLinegraphData(sampleConservationData);
    }
    await customElements.whenDefined("nightingale-conservation-track");
    for (const track of document.getElementsByTagName("nightingale-conservation-track")) {
      (track as any).data = prepareConservationData(sampleConservationData);
    }
  };
  return story;
}


export const LinegraphAndConservation = makeStory({
  length: sampleSequence.length,
});
