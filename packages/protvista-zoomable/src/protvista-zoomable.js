import * as d3 from 'd3';

class ProtvistaZoomable extends HTMLElement {

    constructor() {
        super();
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
        this._originXScale = this.xScale.copy();
        this.initZoom();
        this.listenForResize();
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
        // this.applyZoomTranslation();
    }

    get svg() {
        return this._svg;
    }

    updateScaleDomain() {
        this.xScale = d3
            .scaleLinear()
            .domain([
                1, this._length
            ])
            .range([
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

    static get observedAttributes() {
        return ['displaystart', 'displayend'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            const value = parseFloat(newValue);
            this[name] = isNaN(newValue) ? newValue : value;
            this.applyZoomTranslation();
        }
    }

    zoomed() {
        this.xScale = d3.event
                .transform
                .rescaleX(this._originXScale);
        this.refresh();

        // If the source event is null the zoom wasn't initiated by this component, don't send event
        if(!d3.event.sourceEvent) return;
        this.dispatchEvent(new CustomEvent("change", {
            detail: { displayend: this.xScale.domain()[1], displaystart: this.xScale.domain()[0] }, bubbles: true, cancelable: true
        }));
    }

    applyZoomTranslation() {
        if (!this.svg) return;
        const k = this.width / (this.xScale(this.displayEnd) - this.xScale(this.displayStart));
        this
            .svg
            .transition()
            .duration(300)
            .call(this.zoom.transform, d3.zoomIdentity.scale(k).translate(-this.xScale(this.displayStart), 0));
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