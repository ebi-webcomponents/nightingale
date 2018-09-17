var wc = (function (d3) {
  'use strict';

  const height = 40,
        padding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  };

  class ProtVistaNavigation extends HTMLElement {
    constructor() {
      super();
      this._x = null;
      this.dontDispatch = false;
    }

    connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.width = this.offsetWidth;
      this._length = parseFloat(this.getAttribute('length'));
      this._displaystart = parseFloat(this.getAttribute('displaystart')) || 1;
      this._displayend = parseFloat(this.getAttribute('displayend')) || this._length;
      this._highlightStart = parseFloat(this.getAttribute('highlightStart'));
      this._highlightEnd = parseFloat(this.getAttribute('highlightEnd'));
      this._onResize = this._onResize.bind(this);

      this._createNavRuler();
    }

    disconnectedCallback() {
      if (this._ro) {
        this._ro.unobserve(this);
      } else {
        window.removeEventListener(this._onResize);
      }
    }

    static get observedAttributes() {
      return ['length', 'displaystart', 'displayend', 'highlightStart', 'highlightEnd', 'width'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this[`_${name}`] = parseFloat(newValue);

        this._updateNavRuler();
      }
    }

    get width() {
      return this._width;
    }

    set width(width) {
      this._width = width;
    }

    get isManaged() {
      return true;
    }

    _createNavRuler() {
      this._x = d3.scaleLinear().range([padding.left, this.width - padding.right]);

      this._x.domain([1, this._length]);

      this._svg = d3.select(this).append('div').attr('class', '').append('svg').attr('id', '').attr('width', this.width).attr('height', height);
      this._xAxis = d3.axisBottom(this._x);
      this._displaystartLabel = this._svg.append("text").attr('class', 'start-label').attr('x', 0).attr('y', height - padding.bottom);
      this._displayendLabel = this._svg.append("text").attr('class', 'end-label').attr('x', this.width).attr('y', height - padding.bottom).attr('text-anchor', 'end');
      this._axis = this._svg.append('g').attr('class', 'x axis').call(this._xAxis);
      this._viewport = d3.brushX().extent([[padding.left, 0], [this.width - padding.right, height * 0.51]]).on("brush", () => {
        if (d3.event.selection) {
          this._displaystart = d3.format("d")(this._x.invert(d3.event.selection[0]));
          this._displayend = d3.format("d")(this._x.invert(d3.event.selection[1]));
          if (!this.dontDispatch) this.dispatchEvent(new CustomEvent("change", {
            detail: {
              displayend: this._displayend,
              displaystart: this._displaystart,
              extra: {
                transform: d3.event.transform
              }
            },
            bubbles: true,
            cancelable: true
          }));

          this._updateLabels();

          this._updatePolygon();
        }
      });
      this._brushG = this._svg.append("g").attr("class", "brush").call(this._viewport);

      this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

      this.polygon = this._svg.append("polygon").attr('class', 'zoom-polygon').attr('fill', '#777').attr('fill-opacity', '0.3');

      this._updateNavRuler();

      if ('ResizeObserver' in window) {
        this._ro = new ResizeObserver(this._onResize);

        this._ro.observe(this);
      }

      window.addEventListener("resize", this._onResize);
    }

    _onResize() {
      this.width = this.offsetWidth;
      this._x = this._x.range([padding.left, this.width - padding.right]);

      this._svg.attr('width', this.width);

      this._axis.call(this._xAxis);

      this._viewport.extent([[padding.left, 0], [this.width - padding.right, height * 0.51]]);

      this._brushG.call(this._viewport);

      this._updateNavRuler();
    }

    _updateNavRuler() {
      if (this._x) {
        this._updatePolygon();

        this._updateLabels();

        if (this._brushG) {
          this.dontDispatch = true;

          this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

          this.dontDispatch = false;
        }
      }
    }

    _updateLabels() {
      if (this._displaystartLabel) this._displaystartLabel.text(this._displaystart);
      if (this._displayendLabel) this._displayendLabel.attr('x', this.width).text(this._displayend);
    }

    _updatePolygon() {
      if (this.polygon) this.polygon.attr('points', `${this._x(this._displaystart)},${height / 2}
        ${this._x(this._displayend)},${height / 2}
        ${this.width},${height}
        0,${height}`);
    }

  }

  const loadComponent = function () {
    customElements.define('protvista-navigation', ProtVistaNavigation);
  }; // Conditional loading of polyfill


  if (window.customElements) {
    loadComponent();
  } else {
    document.addEventListener('WebComponentsReady', function () {
      loadComponent();
    });
  }

  return ProtVistaNavigation;

}(d3));
//# sourceMappingURL=index.js.map
