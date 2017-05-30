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
    this._end = parseInt(this.getAttribute('end')) || 1;
    this._highlightStart = parseInt(this.getAttribute('highlightStart'));
    this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
  }

  connectedCallback() {
    this._createNavRuler();
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

    svg.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

    const viewport = d3.brushX().extent([[padding.left, 0], [(width - padding.right), height]])
      .on("brush", function() {
        this.dispatchEvent(new CustomEvent("protvista-zoom", {
          detail: {
            x:d3.event.selection[0],
            y:d3.event.selection[1]
          }
        }));
      });

    svg.append("g")
      .attr("class", "brush")
      .call(viewport)
      .call(viewport.move, x.range());


    viewport.domainStartLabel = svg.append("text")
      .attr('class', 'domain-label')
      .attr('x', 0)
      .attr('y', height);

    viewport.domainEndLabel = svg.append("text")
      .attr('class', 'domain-label')
      .attr('x', width)
      .attr('y', height)
      .attr('text-anchor', 'end');

  }
}

export default ProtVistaNavigation;
