
import * as d3 from "d3";
import _includes from 'lodash-es/includes';
import FeatureShape from './FeatureShape';
import NonOverlappingLayout from './NonOverlappingLayout';
import DefaultLayout from './DefaultLayout';
import ProtvistaZoomable from 'protvista-zoomable';
import ConfigHelper from "./ConfigHelper";

const height = 44;

const margin = {
  top: 10,
  bottom: 10
};

class ProtVistaTrack extends ProtvistaZoomable {

  getLayout(data) {
    if (String(this.getAttribute('layout')).toLowerCase() === "non-overlapping")
      return new NonOverlappingLayout({ layoutHeight: height });
    return new DefaultLayout({ layoutHeight: height });
  }

  connectedCallback() {
    super.connectedCallback();
    this._highlightstart = parseInt(this.getAttribute('highlightstart'));
    this._highlightend = parseInt(this.getAttribute('highlightend'));
    this._color = this.getAttribute('color');
    this._shape = this.getAttribute('shape');
    this._featureShape = new FeatureShape();
    this._layoutObj = this.getLayout();

    if (this._data)
      this._createTrack();

    this.addEventListener('load', e => {
      if (_includes(this.children, e.target)) {
        if (e.target.dataset.key === 'config') {
          this._config = new ConfigHelper(e.detail.payload);
          this.refresh();
        } else {
          this.data = e.detail.payload;
        }
      }
    });
  }
  normalizeLocations(data) {
    return data.map(
      (obj) => {
        const { locations, start, end} = obj;
        return locations ?
          obj :
          Object.assign(obj, { locations: [{ fragments: [{ start, end }] }] })
    });
  }

  set data(data) {
    this._data = this.normalizeLocations(data);
    this._createTrack();
  }

  static get observedAttributes() {
    return [
      'length', 'displaystart', 'displayend', 'highlightstart', 'highlightend', 'color', 'shape', 'layout'
    ];
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
    this._layoutObj.init(this._data);

    d3.select(this).selectAll('*').remove();
    d3.select(this).html('');

    this.svg = d3.select(this)
      .append('div')
        .style('line-height', 0)
      .append('svg')
        .attr('width', this.width)
        .attr('height', (height));

    this.highlighted = this.svg.append('rect')
      .attr('class', 'highlighted')
      .attr('fill', 'rgba(255, 235, 59, 0.8)')
      // .attr('stroke', 'black')
      .attr('height', height);

    this.seq_g = this.svg.append('g')
      .attr('class', 'sequence-features');

    this._createFeatures();
    this.refresh();
  }

  _createFeatures() {
    this.featuresG = this.seq_g.selectAll('g.feature-group')
      .data(this._data);

    this.locations = this.featuresG.enter()
      .append('g')
      .attr('class', 'feature-group')
      .attr('id', d => `g_${d.accession}`)
      .selectAll('g.location-group')
      .data(d => d.locations.map((loc) => Object.assign({}, loc, {feature: d})))
      // .data(d => d.locations.map((loc) => ({ feature: d, ...l })))
      .enter().append('g')
      .attr('class', 'location-group');

    this.features = this.locations
      .selectAll('g.fragment-group')
      .data(d => d.fragments.map((loc) => Object.assign({}, loc, {feature: d.feature})))
      // .data(d => d.fragments.map(({ ...l }) => ({ feature: d.feature, ...l })))
      .enter()
      .append('path')
      .attr('class', 'feature')
      .attr('d', f =>
        this._featureShape.getFeatureShape(
          this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f),
          f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature)
        )
      )
      .attr('transform', f =>
        'translate(' + this.xScale(f.start) + ',' + (margin.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
      )
      .attr('fill', f => this._getFeatureColor(f.feature))
      .attr('stroke', f => this._getFeatureColor(f.feature))
      .on('mouseover', f => {
        this.dispatchEvent(new CustomEvent("change", {
          detail: { highlightend: f.end, highlightstart: f.start }, bubbles: true, cancelable: true
        }));
      })
      .on('mouseout', () => {
        this.dispatchEvent(new CustomEvent("change", {
          detail: { highlightend: null, highlightstart: null }, bubbles: true, cancelable: true
        }));
      });
  }

  refresh() {
    if (this.xScale && this.seq_g) {
      this.features = this.seq_g.selectAll('path.feature')
        .data(this._data.reduce(
          (acc, f) => acc.concat(f.locations.reduce(
            (acc2, e) => acc2.concat(e.fragments
              // .map(({ ...l }) => ({ feature: f, ...l }))
              .map((loc) => Object.assign({}, loc, {feature: f}))
            ),
            [])
          ), []));
      this.features
        .attr('d', f =>
          this._featureShape.getFeatureShape(
            this.xScale(2) - this.xScale(1), this._layoutObj.getFeatureHeight(f),
            f.end ? f.end - f.start + 1 : 1, this._getShape(f.feature)
          )
        )
        .attr('transform', f =>
          'translate(' + this.xScale(f.start) + ',' + (margin.top + this._layoutObj.getFeatureYPos(f.feature)) + ')'
        );
      this._updateHighlight();
    }
  }
  _updateHighlight() {
    if (Number.isInteger(this._highlightstart) && Number.isInteger(this._highlightend)) {
      this.highlighted
        .attr('x', this.xScale(this._highlightstart - 0.5))
        .style('opacity', 0.3)
        .attr('width',
        this.xScale(this._highlightend - this._highlightstart + 1)-this.xScale(0)
        );
    } else {
      this.highlighted.style('opacity', 0);
    }

  }

}


export default ProtVistaTrack;
