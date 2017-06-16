import * as d3 from "d3";

const height = 40,
  width = 700,
  padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

class ProtVistaSequence extends HTMLElement {

  constructor() {
    super();
    this._length = parseInt(this.getAttribute('length'));
    this._start = parseInt(this.getAttribute('start')) || 1;
    this._end = parseInt(this.getAttribute('end')) || this._length;
    this._highlightStart = parseInt(this.getAttribute('highlightStart'));
    this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
    this.data = {
      sequence: "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP"
    }
  }

  connectedCallback() {
    this._createSequence();
  }

  static get observedAttributes() {return [
    'length', 'start', 'end', 'highlightStart', 'highlightEnd'
  ]; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue){
      this[`_${name}`] = parseInt(newValue);
      this._updateSequence();
    }
  }


  _createSequence() {
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

    this.xAxis = d3.axisBottom(x);
    this.axis = svg.append('g')
      .attr('class', 'x axis')
      .call(this.xAxis);
    this.axis.select('.domain').remove();
    this.axis.selectAll('.tick line').remove();
    this.seq_g = svg.append('g')
      .attr('class', 'sequence')
      .attr('transform', `translate(${-x(this._start-0.5)},30)`);
    this.bases = this.seq_g.selectAll('text.base')
      .data(this.data.sequence.split(''));

    this.bases.enter()
      .append('text')
      .attr('class', 'base')
      .style('text-anchor', 'middle')
      .attr('x', (b,i) => x(i+1))
      .text(d=>d);
  }
  _updateSequence(){
    if (this._x) {
      this._x.domain([this._start, this._end]);
      this.axis.call(this.xAxis);
      this.axis.select('.domain').remove();
      this.axis.selectAll('.tick line').remove();
      this.seq_g.attr('transform',
        `translate(${-this._x(this._start-0.5)},30)`
      );
      const space = this._x(2) - this._x(1)
        - this.seq_g.select('text.base').node().getBBox().width * 0.8;
      this.seq_g
        .style('opacity', Math.min(1, space));
      this.bases = this.seq_g.selectAll('text.base')
        .data(this.data.sequence.split(''));
      this.bases
        .attr('x', (b,i) => this._x(i+1));
    }
  }
}


export default ProtVistaSequence;
