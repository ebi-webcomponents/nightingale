import ProtvistaTrack from "@nightingale-elements/nightingale-track";
import { scaleLinear, select, line, max } from "d3";

class ProtvistaVariationGraph extends ProtvistaTrack {
  constructor() {
    super();
    this._line = line()
      .x(
        (_, i) =>
          this.getXFromSeqPosition(i + 1) - this.getSingleBaseWidth() / 2
      )
      .y((d) => this._yScale(d));
  }

  init() {
    this._totalsArray = { total: null, diseaseTotal: null };
  }

  connectedCallback() {
    super.connectedCallback();

    this._data = undefined;

    this._height = Number(this.getAttribute("height")) || 40;
    this._yScale = scaleLinear();
    this.init();
  }

  set data(data) {
    this.init();
    if (!data.sequence || data.variants.length <= 0) {
      return;
    }

    this._totalsArray.total = new Uint8ClampedArray(data.sequence.length);
    this._totalsArray.diseaseTotal = new Uint8ClampedArray(
      data.sequence.length
    );

    for (const { start, association } of data.variants) {
      const index = +start;
      // skip if the variant is outside of bounds
      // eslint-disable-next-line no-continue
      if (index < 1 || index > data.sequence.length) continue;

      // eslint-disable-next-line no-plusplus
      this._totalsArray.total[index]++;

      // eslint-disable-next-line no-continue
      if (!association) continue;
      const hasDisease = association.find(
        (association) => association.disease === true
      );
      // eslint-disable-next-line no-plusplus
      if (hasDisease) this._totalsArray.diseaseTotal[index]++;
    }

    this._createTrack();
  }

  _createTrack() {
    select(this).selectAll("svg").remove();
    this.svg = select(this)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this._height);
    this.trackHighlighter.appendHighlightTo(this.svg);
    // Create the visualisation here
    this._initYScale();
    this.refresh();
  }

  _initYScale() {
    this._yScale
      .domain([
        0,
        Math.max(
          max(this._totalsArray.total),
          max(this._totalsArray.diseaseTotal)
        ),
      ])
      .range([this._height, 0]);
  }

  refresh() {
    if (!this.svg) return;
    this.svg.selectAll("path").remove();
    this.svg
      .append("path")
      .attr("d", this._line(this._totalsArray.diseaseTotal))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("transform", "translate(0,0)");
    this.svg
      .append("path")
      .attr("d", this._line(this._totalsArray.total))
      .attr("fill", "none")
      .attr("stroke", "darkgrey")
      .attr("transform", "translate(0,0)");
    this._updateHighlight();
  }
}

export default ProtvistaVariationGraph;
