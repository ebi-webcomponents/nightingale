import * as d3 from "d3";

const height = 40,
  width = 760,
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
    this._displaystart = parseInt(this.getAttribute('displaystart')) || 1;
    this._displayend = parseInt(this.getAttribute('displayend')) || this._length;
    this._highlightstart = parseInt(this.getAttribute('highlightstart'));
    this._highlightend = parseInt(this.getAttribute('highlightend'));
  }

  connectedCallback() {
    if (this.sequence)
      this._createSequence();
  }

  set data(data) {
    if (typeof data === 'string')
      this.sequence = data;
    else if ('sequence' in data)
      this.sequence = data.sequence;

    if (this.sequence)
      this._createSequence();
  }

  static get observedAttributes() {return [
    'length', 'displaystart', 'displayend', 'highlightstart', 'highlightend'
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
      .domain([this._displaystart, this._displayend]);

    const svg = d3.select(this)
      .append('div')
      .attr('class', '')
      .append('svg')
      .attr('id', '')
      .attr('width', width)
      .attr('height', (height));

    this.xAxis = d3.axisBottom(this._x);
    this.axis = svg.append('g')
      .attr('class', 'x axis');

    this.seq_g = svg.append('g')
      .attr('class', 'sequence')
      .attr('transform', `translate(0,30)`);

    this.highlighted = svg.append('rect')
      .attr('class', 'highlighted')
      .attr('fill', 'yellow')
      .attr('height', height);

    this.overlay = svg.append('rect')
      .attr('class', 'overlay')
      .attr('fill', 'transparent')
      .style('cursor', 'move')
      .attr('width', width)
      .attr('height', height)
      .call(d3.drag()
          .on('drag', ()=>{
            const l = this._displayend - this._displaystart;

            const x0 = this._x.range()[0] + d3.event.dx;
            const dx = this._displaystart - this._x.invert(x0);
            this._displaystart = Math.max(1, this._displaystart + dx);
            this._displayend = this._displaystart + l;
            if (this._displayend > this._length+1){
              this._displayend = this._length+1;
              this._displaystart = this._displayend - l;
            }
            this.dispatchEvent(new CustomEvent("change", {
              detail: {displayend: this._displayend, displaystart: this._displaystart}, bubbles:true, cancelable: true
            }));
          })
      );
    this._updateSequence();
  }
  _updateSequence(){
    if (this._x) {
      this._x.domain([this._displaystart, this._displayend]);

      this.axis.call(this.xAxis);
      this.axis.select('.domain').remove();
      this.axis.selectAll('.tick line').remove();

      this.bases = this.seq_g.selectAll('text.base')
        .data(this.sequence.split(''));
      this.bases.enter()
        .append('text')
        .attr('class', 'base')
        .attr('x', (b,i) => this._x(i+1))
        .text(d=>d);
      this.bases.attr('x', (b,i) => this._x(i+1));

      const space = this._x(2) - this._x(1)
        - this.seq_g.select('text.base').node().getBBox().width * 0.8;
      this.seq_g.style('opacity', Math.min(1, space));

      if (Number.isInteger(this._highlightstart) && Number.isInteger(this._highlightend)){
        this.highlighted
          .attr('x', this._x(this._highlightstart))
          .style('opacity', 0.3)
          .attr('width',
            this._x(this._displaystart +
              Math.max(1, this._highlightend - this._highlightstart)
            )
          );
      } else {
        this.highlighted.style('opacity', 0);
      }
    }
  }
}


export default ProtVistaSequence;
