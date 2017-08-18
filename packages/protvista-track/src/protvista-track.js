import * as d3 from "d3";
import _includes from 'lodash-es/includes';
import FeatureShape from './FeatureShape';
import NonOverlappingLayout from './NonOverlappingLayout';
import ConfigHelper from "./ConfigHelper";

const height = 44,
  width = 760,
  padding = {
    top: 2,
    right: 10,
    bottom: 2,
    left: 10
  };

class ProtVistaTrack extends HTMLElement {
  constructor() {
    super();
    this._length = parseInt(this.getAttribute('length'));
    this._displaystart = parseInt(this.getAttribute('displaystart')) || 1;
    this._displayend = parseInt(this.getAttribute('displayend')) || this._length;
    this._highlightstart = parseInt(this.getAttribute('highlightstart'));
    this._highlightend = parseInt(this.getAttribute('highlightend'));
    this._color = this.getAttribute('color');
    this._shape = this.getAttribute('shape');
    this._featureShape = new FeatureShape();
    this._layout = undefined;
  }

  connectedCallback() {
    if (this._data)
      this._createTrack();

    this.addEventListener('load', e => {
      if (_includes(this.children, e.target)) {
        if (e.path[0].localName === 'protvista-config-data-loader') {
            this._config = new ConfigHelper(e.detail.payload);
            this._updateTrack();
        } else {
          this.data = e.detail.payload;
        }
      }
    });
  }

  set data(data) {
    this._data = data;
    this._createTrack();
  }

  static get observedAttributes() {
    return [
      'length', 'displaystart', 'displayend', 'highlightstart', 'highlightend', 'color', 'shape'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue){
      const intValue = parseInt(newValue);
      this[`_${name}`] = isNaN(intValue) ? newValue : intValue;
      this._updateTrack();
    }
  }

  _getFeatureColor(f) {
    if (f.color) {
      return f.color
    } else if (this._color) {
      return this._color;
    } else if (this._config) {
        return this._config.getColorByType(f.type);
    } else {
      return 'black';
    }
  }

  _getShape(f) {
    if (f.shape) {
      return f.shape
    } else if (this._shape) {
      return this._shape;
    } else if (this._config) {
        return this._config.getShapeByType(f.type);
    } else {
      return 'rectangle';
    }
  }

  _createTrack() {
    this._layout = new NonOverlappingLayout(this._data, height);

    this._xScale = d3.scaleLinear()
      .range([padding.left, width - padding.right])
      .domain([this._displaystart, this._displayend + 1]);

    d3.select(this).selectAll('*').remove();
    d3.select(this).html('');

    const svg = d3.select(this)
      .append('div')
      .append('svg')
      .attr('width', width)
      .attr('height', (height));

    this.highlighted = svg.append('rect')
      .attr('class', 'highlighted')
      .attr('fill', 'yellow')
      .attr('height', height);

    this.seq_g = svg.append('g')
      .attr('class', 'sequence-features');

    this.features = this.seq_g.selectAll('path.feature')
      .data(this._data);

    this.features.enter()
      .append('path')
      .attr('class', 'feature')
      .attr('d', f =>
        this._featureShape.getFeatureShape(
          this._xScale(2) - this._xScale(1), this._layout.getFeatureHeight(),
            f.end ? f.end - f.start + 1 : 1, this._getShape(f)
        )
      )
      .attr('transform', f =>
        'translate(' + this._xScale(f.start)+ ',' + (padding.top + this._layout.getFeatureYPos(f)) + ')'
      )
      .attr('fill', f => this._getFeatureColor(f))
      .attr('stroke', f => this._getFeatureColor(f))
      .on('mouseover', f => {
        this.dispatchEvent(new CustomEvent("change", {
          detail: {value: f.end, type: 'highlightend'}, bubbles:true, cancelable: true
        }));
        this.dispatchEvent(new CustomEvent("change", {
          detail: {value: f.start, type: 'highlightstart'}, bubbles:true, cancelable: true
        }));
      })
      .on('mouseout', () => {
        this.dispatchEvent(new CustomEvent("change", {
          detail: {value: null, type: 'highlightend'}, bubbles:true, cancelable: true
        }));
        this.dispatchEvent(new CustomEvent("change", {
          detail: {value: null, type: 'highlightstart'}, bubbles:true, cancelable: true
        }));
      });
    this._updateTrack();
  }

  _updateTrack(){
    if (this._xScale) {
      this._xScale.domain([this._displaystart, this._displayend + 1]);
      this.features = this.seq_g.selectAll('path.feature')
        .data(this._data);

      this.features
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this._xScale(2) - this._xScale(1), this._layout.getFeatureHeight(),
              f.end ? f.end - f.start + 1 : 1, this._getShape(f)
          )
        )
        .attr('transform', f =>
          'translate(' + this._xScale(f.start)+ ',' + (padding.top +  + this._layout.getFeatureYPos(f)) + ')'
        )
      ;

      if (Number.isInteger(this._highlightstart) && Number.isInteger(this._highlightend)){
        this.highlighted
          .attr('x', this._xScale(this._highlightstart))
          .style('opacity', 0.3)
          .attr('width', this._xScale(this._displaystart +
            Math.max(1, this._highlightend - this._highlightstart)
          ));
      } else {
        this.highlighted.style('opacity', 0);
      }
    }
  }
}


export default ProtVistaTrack;
