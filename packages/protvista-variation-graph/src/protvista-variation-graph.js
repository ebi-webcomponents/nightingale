import ProtvistaTrack from "protvista-track";
import { scaleLinear, select, line, max } from "d3";

class ProtvistaVariationGraph extends ProtvistaTrack {
  constructor() {
    super();
    this._line = line()
      .x(d => {
        return this.getXFromSeqPosition(d.x) - this.getSingleBaseWidth() / 2;
      })
      .y(d => this._yScale(d.y));
  }

  init() {
    this._totalsArray = null;
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

    this._totalsArray = Array(data.sequence.length)
      .fill()
      .map(() => {
        return {
          total: 0,
          diseaseTotal: 0
        };
      });

    data.variants.forEach(v => {
      // eslint-disable-next-line no-plusplus
      this._totalsArray[v.start].total++;
      if (typeof v.association !== "undefined") {
        const hasDisease = v.association.find(
          association => association.disease === true
        );
        if (hasDisease) {
          // eslint-disable-next-line no-plusplus
          this._totalsArray[v.start].diseaseTotal++;
        }
      }
    });
    this._createTrack();
  }

  _createTrack() {
    select(this)
      .selectAll("svg")
      .remove();
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
      .domain([0, max(this._totalsArray.map(d => d.total))])
      .range([this._height, 0]);
  }

  refresh() {
    if (!this.svg) return;
    this.svg.selectAll("path").remove();
    this.svg
      .append("path")
      .attr(
        "d",
        this._line(
          this._totalsArray.map((d, i) => {
            return {
              x: i + 1,
              y: d.diseaseTotal
            };
          })
        )
      )
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "1.5px")
      .attr("stroke-dasharray", "0")
      .attr("transform", "translate(0,0)");
    this.svg
      .append("path")
      .attr(
        "d",
        this._line(
          this._totalsArray.map((d, i) => {
            return {
              x: i + 1,
              y: d.total
            };
          })
        )
      )
      .attr("fill", "none")
      .attr("stroke", "darkgrey")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", ".5")
      .attr("transform", "translate(0,0)");
    this._updateHighlight();
  }
}

export default ProtvistaVariationGraph;
