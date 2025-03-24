import NightingaleElement, {
  withDimensions,
  withHighlight,
  withManager,
  withMargin,
  withPosition,
  withResizable,
} from "@nightingale-elements/nightingale-new-core";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./components/Canvas/SequenceViewer";
import SequenceViewerComponent from "./components/Canvas/SequenceViewer";
import "./components/Labels";
import LabelsComponent from "./components/Labels";
import { Region, SequencesMSA } from "./types/types";
import object2style from "./utils/object2style";
import conservationInlineWorkerString from "./workers/conservation-inline-worker";

const DEAFULT_TILE_HEIGHT = 20;
const DEAFULT_COLOR_SCHEME = "clustal2";
@customElement("nightingale-msa")
class NightingaleMSA extends withManager(
  withResizable(
    withHighlight(withMargin(withDimensions(withPosition(NightingaleElement)))),
  ),
) {
  @property({
    attribute: "color-scheme",
  })
  colorScheme?: string = DEAFULT_COLOR_SCHEME;
  @property({
    type: Number,
    attribute: "label-width",
  })
  labelWidth?: number = 0;
  @property({
    type: Number,
    attribute: "tile-height",
  })
  tileHeight?: number = DEAFULT_TILE_HEIGHT;
  @property({
    attribute: "active-label",
    reflect: true,
  })
  activeLabel?: string = "";
  @property({
    type: Number,
    attribute: "conservation-sample-size",
  })
  sampleSize?: number = 20;
  @property({
    type: Boolean,
    attribute: "overlay-conservation",
  })
  overlayConservtion?: boolean = false;

  worker = new Worker(
    window.URL.createObjectURL(new Blob([conservationInlineWorkerString])),
  );

  private sequenceViewer?: SequenceViewerComponent | null;
  private labelPanel?: LabelsComponent | null;

  constructor() {
    super();
    this.worker.onmessage = (e) => {
      this.dispatchEvent(
        new CustomEvent("conservationProgress", {
          bubbles: true,
          detail: e.data,
        }),
      );
      if (e.data.progress === 1) {
        const conservation = {
          ...e.data,
          map: e.data.conservation,
        };
        this.sequenceViewer?.setProp("conservation", conservation);
      }
    };
  }

  set data(sequences: SequencesMSA) {
    this.length = Math.max(...sequences.map(({ sequence }) => sequence.length));
    const seqs = {
      raw: sequences,
      length: sequences.length,
      maxLength: this.length,
    };
    if (this.sequenceViewer) this.sequenceViewer.sequences = seqs;
    if (this.labelPanel)
      this.labelPanel.labels = sequences.map(({ name }) => name);

    this.worker.postMessage({ sequences, sampleSize: this.sampleSize });
  }

  set features(features: Array<Region>) {
    if (this.sequenceViewer) this.sequenceViewer.features = features;
  }

  getColorMap() {
    return this.sequenceViewer?.getColorMap();
  }

  override render() {
    const containerStyle = {
      display: "flex",
      "align-items": "stretch",
    };
    const topMarginStyle = {
      height: `${this["margin-top"]}px`,
      width: "100%",
      background: this["margin-color"],
    };
    const leftMarginStyle = {
      width: `${this["margin-left"]}px`,
      background: this["margin-color"],
    };
    const rightMarginStyle = {
      width: `${this["margin-right"]}px`,
      background: this["margin-color"],
    };
    const bottomMarginStyle = {
      height: `${this["margin-bottom"]}px`,
      width: "100%",
      background: this["margin-color"],
    };
    const labelWidth = this.labelWidth || 0;
    const tileHeight = this.tileHeight || DEAFULT_TILE_HEIGHT;
    return html`
      ${this["margin-top"] > 0
        ? html`<div style=${object2style(topMarginStyle)}></div>`
        : ""}
      <div style=${object2style(containerStyle)}>
        ${labelWidth > 0
        ? html`<msa-labels
              width=${labelWidth}
              height=${this.height}
              tile-height=${tileHeight}
              active-label=${this.activeLabel || ""}
            ></msa-labels>`
        : ""}

        <div style=${object2style(leftMarginStyle)}></div>
        <msa-sequence-viewer
          height=${this.height}
          width=${this.getWidthWithMargins() - labelWidth}
          color-scheme=${this.colorScheme || DEAFULT_COLOR_SCHEME}
          tile-height=${tileHeight}
          display-start=${this["display-start"] || 0}
          display-end=${this["display-end"] || 0}
          length=${this.length || 0}
          ?overlay-conservation=${this.overlayConservtion}
        ></msa-sequence-viewer>
        <div style=${object2style(rightMarginStyle)}></div>
      </div>
      ${this["margin-bottom"] > 0
        ? html`<div style=${object2style(bottomMarginStyle)}></div>`
        : ""}
    `;
  }
  override updated() {
    if (!this.sequenceViewer?.sequences) return;
    this.sequenceViewer.highlight = this.highlightedRegion.segments.map(
      ({ start, end }) =>
        ({
          sequences: {
            from: 0,
            to: (this.sequenceViewer?.sequences || []).length - 1,
          },
          residues: {
            from: start,
            to: end,
          },
          fillColor: this["highlight-color"],
          borderColor: this["highlight-color"],
        }) as Region,
    );
  }
  protected override firstUpdated() {
    this.sequenceViewer = this.renderRoot.querySelector("msa-sequence-viewer");
    this.labelPanel = this.renderRoot.querySelector("msa-labels");

    if (!this.sequenceViewer) return;

    this.sequenceViewer.position = {
      xPos: 0,
      yPos: 0,
    };

    this.addEventListener("fake-scroll", () => {
      if (this.labelPanel && this.sequenceViewer)
        this.labelPanel.y = this.sequenceViewer.position.yPos;
    });
    this.addEventListener("msa-active-label", () => {
      if (this.labelPanel) this.activeLabel = this.labelPanel.activeLabel;
    });
  }
}

export default NightingaleMSA;
