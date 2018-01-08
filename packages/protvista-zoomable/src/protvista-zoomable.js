import * as d3 from 'd3';
import cloneDeep from 'lodash-es/cloneDeep';

class ProtvistaZoomable extends HTMLElement {

    constructor() {
        super();
        // this._margin = {
        //     top: 10,
        //     right: 10,
        //     bottom: 10,
        //     left: 10
        // }
        this.style.display = 'block';
        this.style.width = '100%';
        this.width = this.offsetWidth;

        this._length = this.getAttribute('length') ? parseInt(this.getAttribute('length')) : 0;

        this.displayStart = this.getAttribute('displaystart')
            ? parseInt(this.getAttribute('displaystart'))
            : 0;
        this.displayEnd = this.getAttribute('displayEnd')
            ? parseInt(this.getAttribute('displayEnd'))
            : this.width;

        this.updateScaleDomain = this.updateScaleDomain.bind(this);
        this.initZoom = this.initZoom.bind(this);
        this.zoomed = this.zoomed.bind(this);
        this.applyZoomTranslation = this.applyZoomTranslation.bind(this);
        this.listenForResize = this.listenForResize.bind(this);

        this.updateScaleDomain();
        this.initZoom();
        this.listenForResize();
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
        if (!this._originXScale)
            this._originXScale = cloneDeep(xScale);
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

    // get margin() {
    //     return this._margin;
    // }

    updateScaleDomain() {
        this.xScale = d3
            .scaleLinear()
            .domain([
                1, this._length
            ])
            .range([
                // this._margin.left, this.width - this._margin.right
                0, this._width
            ]);
    }

    initZoom() {
        this._zoom = d3.zoom()
            .scaleExtent([1, 4])
            .translateExtent([
                [
                    this.xScale(1), 0
                ],
                [this.width, 0]
            ])
            .on("zoom", this.zoomed);
    }

    zoomed() {
        this.xScale =
            d3.event
                .transform
                .rescaleX(this._originXScale);
        this.refresh();
        // TODO calculate new displaystart/displayend positions
        this.dispatchEvent(new CustomEvent("change", {
            detail: { displayend: this.displayend, displaystart: this.displaystart }, bubbles: true, cancelable: true
        }));
    }

    applyZoomTranslation() {
        const k = this.width / (this.xScale(this.displayEnd) - this.xScale(this.displayStart));
        this
            .svg
            .transition()
            .duration(300)
            .call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(-this.xScale(this.displayStart) , 0));
        this.refresh();
    }

    listenForResize() {
        // TODO add sleep to make transition appear smoother. Could experiment with CSS3
        // transitions too
        window.onresize = () => {
            this.width = this
                .offsetWidth;
            //TODO trigger repaint here
        };
    }

}

export default ProtvistaZoomable;