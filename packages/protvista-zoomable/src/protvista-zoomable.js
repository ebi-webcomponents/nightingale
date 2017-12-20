import * as d3 from 'd3';
import cloneDeep from 'lodash-es/cloneDeep';

class ProtvistaZoomable extends HTMLElement {

    constructor() {
        super();
        this._margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
        this.width = this.getAttribute('width') ? this.getAttribute('width') : this.offsetWidth;
        this.length = this.getAttribute('length') ? parseInt(this.getAttribute('length')) : 0;

        this.displayStart = this.getAttribute('displaystart')
            ? parseInt(this.getAttribute('displaystart'))
            : 0;
        this.displayEnd = this.getAttribute('displayEnd')
            ? parseInt(this.getAttribute('displayEnd'))
            : this.width;

        this.initZoom = this.initZoom.bind(this);
        this.updateScaleDomain = this.updateScaleDomain.bind(this);
        this.zoomed = this.zoomed.bind(this);
        this.applyZoomTranslation = this.applyZoomTranslation.bind(this);
    }

    get displayStart() {
        return this.getAttribute('displaystart');
    }

    set displayStart(displaystart) {
        if (displaystart !== this.getAttribute('displaystart')) {
            this.setAttribute('displaystart', displaystart);
        }
    }

    get displayEnd() {
        return this.getAttribute('displayend');
    }

    set displayEnd(displayend) {
        if (displayend !== this.getAttribute('displayend')) {
            this.setAttribute('displayend', displayend);
        }
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
        this.initZoom();
    }

    set length(length) {
        this._length = length;
        this.updateScaleDomain();
    }

    get length() {
        return this._length;
    }

    get xScale() {
        return this._xScale
    }

    set xScale(xScale) {
        this._xScale = xScale;
        if(!this._originXScale)
            this._originXScale = cloneDeep(xScale);
    }

    get zoom() {
        return this._zoom;
    }

    set svg(svg) {
        this._svg = svg;
        svg.call(this._zoom);
    }

    get svg() {
        return this._svg;
    }

    updateScaleDomain() {
        this.xScale = d3
            .scaleLinear()
            .domain([
                1, this._length + 1
            ])
            .range([
                this._margin.left, this._width - this._margin.right
            ]);
    }

    initZoom() {
        this._zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([
                [
                    0,100
                ],
                [this.width, 100]
            ])
            .on("zoom", this.zoomed);
    }

    zoomed() {
        this.xScale =
            d3.event
                .transform
                .rescaleX(this._originXScale);
        this.refresh();
    }

    applyZoomTranslation() {
        // TODO pass the SVG here or SVG should be on zoomable?
        this._zoomScale = (this._length - this.displayEnd) / this.displayStart;
        this
            ._svg
            .transition()
            .duration(300)
            .call(this._zoom.transform, d3.zoomIdentity.translate((-(this._xScale(this.displayStart) * this._zoomScale) + this._margin.left), 0).scale(this._zoomScale));
        this.refresh();
    }

}

export default ProtvistaZoomable;