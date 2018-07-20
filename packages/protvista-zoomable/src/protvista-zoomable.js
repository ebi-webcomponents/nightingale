import {
  scaleLinear,
  zoom as d3zoom,
  zoomIdentity,
  event as d3Event
} from 'd3';
import ResizeObserver from 'resize-observer-polyfill';

class ProtvistaZoomable extends HTMLElement {

    constructor() {
        super();

        this.updateScaleDomain = this.updateScaleDomain.bind(this);
        this.initZoom = this.initZoom.bind(this);
        this.zoomed = this.zoomed.bind(this);
        this._applyZoomTranslation = this.applyZoomTranslation.bind(this);
        let aboutToApply = false;
        this.applyZoomTranslation = () => {
          if (aboutToApply) return;
          aboutToApply = true;
          requestAnimationFrame(() => {
            aboutToApply = false;
            this._applyZoomTranslation();
          });
        };
        this._onResize = this._onResize.bind(this);
        this.listenForResize = this.listenForResize.bind(this);
    }

    connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.width = this.offsetWidth;

      this._length = this.getAttribute('length') ? parseFloat(this.getAttribute('length')) : 0;

      this._displaystart = this.getAttribute('displaystart')
          ? parseFloat(this.getAttribute('displaystart'))
          : 0;
      this._displayend = this.getAttribute('displayend')
          ? parseFloat(this.getAttribute('displayend'))
          : this.width;
      this.updateScaleDomain();
      this._originXScale = this.xScale.copy();
      this.initZoom();
      this.listenForResize();
      this.addEventListener('error', e => { throw e; });
    }

    disconnectedCallback() {
      if (this._ro) {
        this._ro.unobserve(this);
      } else {
        window.removeEventListener("resize", this._onResize);
      }
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    set length(length) {
        this._length = length;
    }

    get length() {
        return this._length;
    }

    get xScale() {
        return this._xScale
    }

    set xScale(xScale) {
        this._xScale = xScale;
    }

    get zoom() {
        return this._zoom;
    }

    set svg(svg) {
        this._svg = svg;
        svg.call(this._zoom);
        this.applyZoomTranslation();
    }

    get svg() {
        return this._svg;
    }

    get isManaged() {
        return true;
    }

    updateScaleDomain() {
        this.xScale = scaleLinear()
            .domain([
                1, this._length+1
            ])
            .range([
                0, this._width
            ]);
    }

    initZoom() {
        this._zoom = d3zoom()
            .scaleExtent([1, 4])
            .translateExtent([
                [
                    this.xScale(2), 0
                ],
                [this.width, 0]
            ])
            .on("zoom", this.zoomed);
    }

    static get observedAttributes() {
        return ['displaystart', 'displayend', 'length'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            const value = parseFloat(newValue);
            this[`_${name}`] = isNaN(value) ? newValue : value;

            if(name === 'length') {
                this.updateScaleDomain();
                this._originXScale = this.xScale.copy();
            }

            this.applyZoomTranslation();
        }
    }

    zoomed() {
        this.xScale = d3Event.transform
                .rescaleX(this._originXScale);

        // If the source event is null the zoom wasn't initiated by this component, don't send event
        if(this.dontDispatch) return;
        this.dispatchEvent(new CustomEvent("change", {
            detail: {
              displaystart: this.xScale.domain()[0],
              displayend: this.xScale.domain()[1]
            }, bubbles: true, cancelable: true
        }));
    }

    applyZoomTranslation() {
        if (!this.svg || !this._originXScale) return;
        const k = Math.max (1, this.length / (this._displayend + 1 - this._displaystart));
        const dx = -this._originXScale(this._displaystart);
        this.dontDispatch = true;
        this
            .svg
            .call(this.zoom.transform, zoomIdentity.scale(k).translate(dx, 0));
        this.dontDispatch = false;
        this.refresh();
    }

    _onResize() {
       this.width = this.offsetWidth;
       this.updateScaleDomain();
       this._originXScale = this.xScale.copy();
       if (this.svg) this.svg.attr('width', this.width);
       this.applyZoomTranslation();
    }

    listenForResize() {
        // TODO add sleep to make transition appear smoother. Could experiment with CSS3
        // transitions too
        this._ro = new ResizeObserver(this._onResize);
        this._ro.observe(this);
    }

}

export default ProtvistaZoomable;
