import * as d3 from "d3";

const height = 40,
  width = 760,
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
    this._displaystart = parseInt(this.getAttribute('displaystart')) || 1;
    this._displayend = parseInt(this.getAttribute('displayend')) || this._length;
    this._highlightStart = parseInt(this.getAttribute('highlightStart'));
    this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
  }

  connectedCallback() {
    this._createNavRuler();
  }

  static get observedAttributes() {return [
    'length', 'displaystart', 'displayend', 'highlightStart', 'highlightEnd'
  ]; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue){
      this[`_${name}`] = parseInt(newValue);
      this._updateNavRuler();
    }
  }

  _createNavRuler() {
    this._x = d3.scaleLinear().range([padding.left, width - padding.right]);
    this._x.domain([1, (this._length + 1)]);

    const svg = d3.select(this)
      .append('div')
      .attr('class', '')
      .append('svg')
      .attr('id', '')
      .attr('width', width)
      .attr('height', (height));

    const xAxis = d3.axisBottom(this._x);

    this._displaystartLabel = svg.append("text")
                        .attr('class', 'start-label')
                        .attr('x', 0)
                        .attr('y', height - padding.bottom);

    this._displayendLabel = svg.append("text")
                      .attr('class', 'end-label')
                      .attr('x', width)
                      .attr('y', height - padding.bottom)
                      .attr('text-anchor', 'end');
    svg.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

    this._viewport = d3.brushX().extent([
        [padding.left, 0],
        [(width - padding.right), height*0.51]
      ])
      .on("brush", () => {
        if (d3.event.selection){
          this._displaystart = d3.format("d")(this._x.invert(d3.event.selection[0]));
          this._displayend = d3.format("d")(this._x.invert(d3.event.selection[1]));
          this.dispatchEvent(new CustomEvent("change", {
            detail: {displayend: this._displayend, displaystart: this._displaystart}, bubbles:true, cancelable: true
          }));
          this._updateLabels();
          this._updatePolygon();
        }
      });

    this._brushG = svg.append("g")
      .attr("class", "brush")
      .call(this._viewport);

    this._brushG
      .call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

    this.polygon = svg.append("polygon")
      .attr('class', 'zoom-polygon')
      .attr('fill', '#777')
      .attr('fill-opacity','0.3');
    this._updateNavRuler();
  }
  _updateNavRuler(){
    this._updatePolygon();
    this._updateLabels();
    if (this._brushG) this._brushG
      .call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);
  }
  _updateLabels() {
    if (this._displaystartLabel) this._displaystartLabel.text(this._displaystart);
    if (this._displayendLabel) this._displayendLabel.text(this._displayend);
  }
  _updatePolygon(){
    if (this.polygon) this.polygon
      .attr('points',
        `${this._x(this._displaystart)},${height/2}
        ${this._x(this._displayend)},${height/2}
        ${width-padding.right},${height}
        ${padding.left},${height}`
      );
  }
}

export default ProtVistaNavigation;
