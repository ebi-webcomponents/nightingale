import * as d3 from "d3";

const height = 40,
  width = 700,
  padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

class ProtVistaNavigation extends HTMLElement {

  constructor() {
    super();
    this._length = parseInt(this.getAttribute('length'));
    this._start = parseInt(this.getAttribute('start')) || 1;
    this._end = parseInt(this.getAttribute('end')) || this._length;
    this._highlightStart = parseInt(this.getAttribute('highlightStart'));
    this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
  }

  connectedCallback() {
    this._createNavRuler();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //TODO Listen to changes and update
  }

  _updateLabels(startLabel, endLabel) {
    startLabel.text(this._start);
    endLabel.text(this._end);
  }

  _createNavRuler() {
    const x = d3.scaleLinear().range([padding.left, width - padding.right]);
    x.domain([1, (this._length + 1)]);

    const svg = d3.select(this)
      .append('div')
      .attr('class', '')
      .append('svg')
      .attr('id', '')
      .attr('width', width)
      .attr('height', (height));

    const xAxis = d3.axisBottom(x);

    const startLabel = svg.append("text")
                        .attr('class', 'start-label')
                        .attr('x', 0)
                        .attr('y', height - padding.bottom);

    const endLabel = svg.append("text")
                      .attr('class', 'end-label')
                      .attr('x', width)
                      .attr('y', height - padding.bottom)
                      .attr('text-anchor', 'end');
    svg.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

    const viewport = d3.brushX().extent([
        [padding.left, 0],
        [(width - padding.right), height]
      ])
      .on("brush", () => {
        this._start = d3.format("d")(x.invert(d3.event.selection[0]));
        this._end = d3.format("d")(x.invert(d3.event.selection[1]));
        this.dispatchEvent(new CustomEvent("protvista-zoom", {
          detail: {
            start: this._start,
            end: this._end
          }
        }));
        this._updateLabels(startLabel, endLabel);
      });

    svg.append("g")
      .attr("class", "brush")
      .call(viewport)
      .call(viewport.move, [x(this._start), x(this._end)]);
  }
}

export default ProtVistaNavigation;
