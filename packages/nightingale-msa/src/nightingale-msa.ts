import { customElement, property } from "lit/decorators.js";
import { select } from "d3";
import SequenceViewer from "./components/Canvas/SequenceViewer";
import {
  withManager,
  withPosition,
  withZoom,
} from "@nightingale-elements/nightingale-new-core";

type SequencesMSA = Array<{
  name: string;
  sequence: string;
}>;

@customElement("nightingale-msa")
class NightingaleMSA extends withManager(
  withPosition(withZoom(SequenceViewer))
) {
  constructor() {
    super();
    this.position = {
      xPos: 0,
      yPos: 0,
    };
  }
  set data(sequences: SequencesMSA) {
    this.length = Math.max(...sequences.map(({ sequence }) => sequence.length));
    this.sequences = {
      raw: sequences,
      length: sequences.length,
      maxLength: this.length,
    };
    window.requestAnimationFrame(() => {
      this.svg = select(this).select("div");
    });
  }
  zoomRefreshed() {
    this.updateAlignmentProps();
  }
  updateAlignmentProps() {
    this.position = {
      xPos: ((this["display-start"] || 1) - 1) * this.tileWidth,
      yPos: this.position.yPos,
    };
    this.tileWidth = this.getSingleBaseWidth();
  }
}

export default NightingaleMSA;
