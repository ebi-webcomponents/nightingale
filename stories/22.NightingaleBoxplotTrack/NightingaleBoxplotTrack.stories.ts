import { type createEvent } from "@nightingale-elements/nightingale-new-core";
import { type ArgTypes, Meta, Story } from "@storybook/web-components";
import { html } from "lit-html";
import "../../packages/nightingale-boxplot-track/src/index";
import NightingaleBoxplotTrack, { type BoxplotData, ZoomedOutOutlineOptions } from "../../packages/nightingale-boxplot-track/src/nightingale-boxplot-track";
import sampleBoxplotData from "../../packages/nightingale-boxplot-track/tests/mockData/sample-1.json";


export default { title: "Components/Tracks/Boxplot Track" } as Meta;


const DefaultArgs = {
  "min-width": 400,
  "height": 200,
  "highlight-event": "onmouseover",
  "highlight-color": "#EB3BFF22",
  "margin-color": "#ffffffdd",
  "margin-left": 30,
  "show-axis": true,
  "y-min": 0 as number | undefined,
  "y-max": undefined as number | undefined,
  "show-nested-highlights": true,
  "column-gap": 0.2,
  "box-gap": 0.1,
  "whisker-width": 0.6,
  "outlier-jitter-width": 0.4,
  "outlier-radius": 2,
  "zoom-transition-range": "4-5",
  "zoomed-out-outline": "whiskers",
  "tooltips": true,
};
type Args = typeof DefaultArgs;

const ArgumentTypes: Partial<ArgTypes<Args>> = {
  "highlight-event": { control: "select", options: ["onmouseover", "onclick"] },
  "y-min": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
  "y-max": { control: "select", options: [undefined, 0, 100, 200, 300, 400, 500] },
  "column-gap": { control: { type: "number", min: 0, max: 1, step: 0.05 } },
  "box-gap": { control: { type: "number", min: 0, max: 1, step: 0.05 } },
  "whisker-width": { control: { type: "number", min: 0, max: 1, step: 0.05 } },
  "outlier-jitter-width": { control: { type: "number", min: 0, max: 1, step: 0.05 } },
  "outlier-radius": { control: { type: "number", min: 0, step: 0.5 } },
  "zoomed-out-outline": { control: "select", options: ZoomedOutOutlineOptions },
};


const nDataRepeat = 82;
const sampleSequence = "MALYGTHSHGLFKKLGIPGPTPLPFLGNILSYHKGFCMFDMECHKKYGKVWGFYDGQQPVLAITDPDMIKTVLVKECYSVFTNRRPFGPVGFMKSAISIA".repeat(nDataRepeat);

function prepareBoxplotData(data: { positions: { position: number, values: number[] }[] }): BoxplotData {
  const positions = data.positions.map(pos => ({ position: pos.position, values: pos.values.sort() })); // Sorting values for each position is not required by the boxplot track, but can make loading faster.
  const shift = data.positions.length;
  for (let i = 1; i < nDataRepeat; i++) {
    for (const pos of data.positions) {
      positions.push({ position: pos.position + i * shift, values: pos.values });
    }
  }

  return [
    {
      name: "Data1",
      color: "#0088ff",
      positions: positions,
    },
    {
      name: "Data2",
      color: "#ff8800",
      // Dummy data: multiply Data1 by a constant and remove some positions
      positions: remove(positions.map(pos => ({ ...pos, values: pos.values.map(v => v * 0.8) })), 1, 7, 8, 9, 10),
    },
  ];
}

function remove<T>(arr: T[], ...indices: number[]) {
  const out = arr.slice();
  for (const i of indices.sort((a, b) => b - a)) {
    out.splice(i, 1);
  }
  return out;
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
        show-highlight 
        display-end="30"
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
        margin-left=${args["margin-left"]}
        use-ctrl-to-zoom
      >
      </nightingale-sequence>
    </div>`;
}

function nightingaleBoxplotTrack(args: Args & { length: number, id: number }) {
  return html`
    <div class="row">
      <div class="label">Boxplot</div>
      <nightingale-boxplot-track
        id="track-boxplot-${args["id"]}"
        min-width="${args["min-width"]}"
        height=${args["height"]}
        length="${args["length"]}"
        highlight-event="${args["highlight-event"]}"
        highlight-color="${args["highlight-color"]}"
        margin-color=${args["margin-color"]}
        margin-top=10
        margin-bottom=10
        margin-left=${args["margin-left"]}
        use-ctrl-to-zoom
        ?show-axis=${args["show-axis"]}
        y-min=${args["y-min"]}
        y-max=${args["y-max"]}
        ?show-nested-highlights=${args["show-nested-highlights"]}
        column-gap=${args["column-gap"]}
        box-gap=${args["box-gap"]}
        whisker-width=${args["whisker-width"]}
        outlier-jitter-width=${args["outlier-jitter-width"]}
        outlier-radius=${args["outlier-radius"]}
        zoomed-out-outline=${args["zoomed-out-outline"]}
        zoom-transition-range=${args["zoom-transition-range"]}
      >
      </nightingale-boxplot-track>
    </div>`;
}

/** This is a demonstration of how to use CustomEvents on the `nightingale-boxplot-track` component. Tooltips are not a part of the component. */
function handleTooltip(event: CustomEvent, args: Args) {
  if (event.detail.eventType !== "mouseover" && event.detail.eventType !== "mouseout") return;

  type EventFeatureData = Parameters<typeof createEvent>[1];
  const feature: EventFeatureData = event.detail.feature;
  let tooltipDiv = document.getElementById("boxplot-tooltip");
  if (args.tooltips && feature && "type" in feature && feature.type === "boxplot") {
    // Show tooltip
    if (!tooltipDiv) {
      tooltipDiv = document.createElement("div");
      tooltipDiv.id = "boxplot-tooltip";
      Object.assign(tooltipDiv.style, { position: "fixed", background: "white", border: "1px solid #ccc", padding: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", zIndex: "666", fontFamily: "sans-serif", fontSize: "12px" });
      document.body.appendChild(tooltipDiv);
    }
    const rows = [
      ["", ...feature.data.map(d => `<strong style="color:${d.dataset.color}">${d.dataset.name}</strong>`)],
      ["nDatapoints", ...feature.data.map(d => d.datum?.values.length ?? "-")],
      ["nOutliers", ...feature.data.map(d => d.datum?.outliersHigh && d.datum?.outliersLow ? d.datum.outliersHigh.length + d.datum.outliersLow.length : "-")],
      ["Max", ...feature.data.map(d => d.datum?.maximum.toFixed(2) ?? "-")],
      ["Median", ...feature.data.map(d => d.datum?.median.toFixed(2) ?? "-")],
      ["Min", ...feature.data.map(d => d.datum?.minimum.toFixed(2) ?? "-")],
    ];
    const rowsHtml = rows.map((row) => `<tr>${row.map((cell, index) => `<td style="text-align:${index === 0 ? "left" : "right"}; padding:3px;">${cell}</td>`).join("")}</tr>`).join("");
    tooltipDiv.innerHTML = `<table><tbody>${rowsHtml}</tbody></table>`;
    const mouseEvent: MouseEvent | undefined = event.detail.parentEvent;
    tooltipDiv.style.left = `${(mouseEvent?.clientX ?? 0) + 10}px`;
    tooltipDiv.style.top = `${(mouseEvent?.clientY ?? 0) + 10}px`;
  } else {
    // Hide tooltip
    tooltipDiv?.remove();
  }
}


function makeStory(options: { length: number }): Story<Args> {
  let currentArgs: Args = { ...DefaultArgs };

  const template: Story<Args> = (args: Args) => {
    currentArgs = args;
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
            ${nightingaleBoxplotTrack({ ...args, length: options.length, id: 0 })}
          </div>
        </nightingale-manager>
      </div>`;
  }

  const story: Story<Args> = template.bind({});
  story.args = { ...DefaultArgs };
  story.argTypes = ArgumentTypes;
  const boxplotData = prepareBoxplotData(sampleBoxplotData as any);

  story.play = async () => {
    await customElements.whenDefined("nightingale-boxplot-track");
    for (const track of document.getElementsByTagName("nightingale-boxplot-track")) {
      (track as NightingaleBoxplotTrack).data = boxplotData;
      track.addEventListener("change", event => handleTooltip(event as CustomEvent, currentArgs));
    }
  };
  return story;
}


export const Boxplot = makeStory({
  length: sampleSequence.length,
});
