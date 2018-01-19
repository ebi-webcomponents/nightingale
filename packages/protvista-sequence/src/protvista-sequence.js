import * as d3 from "d3";
import ProtvistaZoomable from 'protvista-zoomable';

const height = 40;

class ProtVistaSequence extends ProtvistaZoomable {

  connectedCallback() {
    super.connectedCallback();
    this._highlightstart = parseInt(this.getAttribute('highlightstart'));
    this._highlightend = parseInt(this.getAttribute('highlightend'));
    if (this.sequence) {
      this._createSequence();
    }
  }

  set data(data) {
    if (typeof data === 'string')
      this.sequence = data;
    else if ('sequence' in data)
      this.sequence = data.sequence;

    if (this.sequence)
      this._createSequence();
  }



  _createSequence() {
    super.svg = d3.select(this)
      .append('div')
      .attr('class', '')
      .append('svg')
      .attr('id', '')
      .attr('width', this.width)
      .attr('height', (height));

    this.axis = super.svg.append('g')
      .attr('class', 'x axis');

    this.seq_g = super.svg.append('g')
      .attr('class', 'sequence')
      .attr('transform', `translate(0,30)`);

    this.highlighted = super.svg.append('rect')
      .attr('class', 'highlighted')
      .attr('fill', 'yellow')
      .attr('height', height);

    this.refresh();
  }

  refresh(){
    if (this.axis) {
      this.xAxis = d3.axisBottom(super.xScale);
      this.axis.call(this.xAxis);
      this.axis.select('.domain').remove();
      this.axis.selectAll('.tick line').remove();

      this.bases = this.seq_g.selectAll('text.base')
        .data(this.sequence.split(''));
      this.bases.enter()
        .append('text')
        .attr('class', 'base')
        .attr('x', (b,i) => super.xScale(i+1))
        .text(d=>d)
        .attr('style','font-family:monospace');
      this.bases.attr('x', (b,i) => super.xScale(i+1));

      const space = super.xScale(2) - super.xScale(1)
        - this.seq_g.select('text.base').node().getBBox().width * 0.8;
      this.seq_g.style('opacity', Math.min(1, space));

      if (Number.isInteger(this._highlightstart) && Number.isInteger(this._highlightend)){
        this.highlighted
          .attr('x', super.xScale(this._highlightstart - 0.5))
          .style('opacity', 0.3)
          .attr('width', (super.xScale(2) - super.xScale(1))*
            (this._highlightend - this._highlightstart + 1)
          );
      } else {
        this.highlighted.style('opacity', 0);
      }
    }
  }
}


export default ProtVistaSequence;
