var ProtVistaNavigation = (function (d3) {
'use strict';

const height = 40;
const width = 700;
const padding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

class ProtVistaNavigation$1 extends HTMLElement {

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

  static get observedAttributes() {
    return ['length', 'start', 'end', 'highlightStart', 'highlightEnd'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[`_${name}`] = parseInt(newValue);
      this._updateLabels();
      if (this._brushG) this._brushG.call(this._viewport.move, [this._x(this._start), this._x(this._end)]);
      this._updatePolygon();
    }
  }

  _updateLabels() {
    if (this._startLabel) this._startLabel.text(this._start);
    if (this._endLabel) this._endLabel.text(this._end);
  }

  _createNavRuler() {
    this._x = d3.scaleLinear().range([padding.left, width - padding.right]);
    const x = this._x;
    x.domain([1, this._length + 1]);

    const svg = d3.select(this).append('div').attr('class', '').append('svg').attr('id', '').attr('width', width).attr('height', height);

    const xAxis = d3.axisBottom(x);

    this._startLabel = svg.append("text").attr('class', 'start-label').attr('x', 0).attr('y', height - padding.bottom);

    this._endLabel = svg.append("text").attr('class', 'end-label').attr('x', width).attr('y', height - padding.bottom).attr('text-anchor', 'end');
    svg.append('g').attr('class', 'x axis').call(xAxis);

    this._viewport = d3.brushX().extent([[padding.left, 0], [width - padding.right, height * 0.51]]).on("brush", () => {
      if (d3.event.selection) {
        this._start = d3.format("d")(x.invert(d3.event.selection[0]));
        this._end = d3.format("d")(x.invert(d3.event.selection[1]));
        this.dispatchEvent(new CustomEvent("change", {
          detail: {
            value: this._start,
            type: 'start'
          }
        }));
        this.dispatchEvent(new CustomEvent("change", {
          detail: {
            value: this._end,
            type: 'end'
          }
        }));
        this._updateLabels();
        this._updatePolygon();
      }
    });

    this._brushG = svg.append("g").attr("class", "brush").call(this._viewport);

    this._brushG.call(this._viewport.move, [x(this._start), x(this._end)]);

    this.polygon = svg.append("polygon").attr('class', 'zoom-polygon').attr('fill', '#777').attr('fill-opacity', '0.3');
    this._updatePolygon();
  }
  _updatePolygon() {
    if (this.polygon) this.polygon.attr('points', `${this._x(this._start)},${height / 2}
        ${this._x(this._end)},${height / 2}
        ${width - padding.right},${height}
        ${padding.left},${height}`);
  }
}

if (window.customElements) {
  customElements.define('protvista-navigation', ProtVistaNavigation$1);
}

return ProtVistaNavigation$1;

}(d3));
//# sourceMappingURL=protvista-navigation.js.map
