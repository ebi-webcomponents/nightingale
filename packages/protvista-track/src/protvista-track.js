import * as d3 from "d3";

const height = 40,
  width = 700,
  padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

class ProtVistaTrack extends HTMLElement {

  constructor() {
    super();
    this._length = parseInt(this.getAttribute('length'));
    this._start = parseInt(this.getAttribute('start')) || 1;
    this._end = parseInt(this.getAttribute('end')) || this._length;
    this._highlightStart = parseInt(this.getAttribute('highlightStart'));
    this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
  }

  connectedCallback() {
    if (this._data)
      this._createTrack();
  }

  set data(data) {
    this._data = data;
    this._createTrack();
  }

  static get observedAttributes() {return [
    'length', 'start', 'end', 'highlightStart', 'highlightEnd'
  ]; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue){
      this[`_${name}`] = parseInt(newValue);
      this._updateTrack();
    }
  }


  _createTrack() {
    this._x = d3.scaleLinear()
      .range([padding.left, width - padding.right])
      .domain([this._start, this._end]);
    const x = this._x;

    const svg = d3.select(this)
      .append('div')
      .attr('class', '')
      .append('svg')
      .attr('id', '')
      .attr('width', width)
      .attr('height', (height));

    this.seq_g = svg.append('g')
      .attr('class', 'sequence')
      .attr('transform', `translate(${-x(this._start-0.5)},0)`);
    this.features = this.seq_g.selectAll('rect.feature')
      .data(this._data);

    this.features.enter()
      .append('rect')
      .attr('class', 'feature')
      .attr('x', f => x(f.start))
      .attr('y', height/4)
      .attr('width', f => Math.abs(x(this._start+f.end-f.start)))
      .attr('fill', f => f.color)
      .attr('height', height/2);
  }
  _updateTrack(){
    if (this._x) {
      this._x.domain([this._start, this._end]);
      this.seq_g.attr('transform',
        `translate(${-this._x(this._start-0.5)},0)`
      );
      this.features = this.seq_g.selectAll('rect.feature')
        .data(this._data);

      this.features
        .attr('x', f => this._x(f.start))
        .attr('width', f => Math.abs(this._x(this._start+f.end-f.start)));
    }
  }
}


export default ProtVistaTrack;
