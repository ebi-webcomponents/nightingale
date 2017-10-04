import * as d3 from 'd3';

const aaList = ['G', 'A', 'V', 'L', 'I', 'S', 'T', 'C', 'M', 'D', 'N', 'E', 'Q', 'R', 'K', 'H', 'F', 'Y', 'W', 'P', 'd', '*'];

class ProtvistaVariation extends HTMLElement {

    constructor() {
        super();
        this._accession = this.getAttribute('accession');
        this._length = parseInt(this.getAttribute('length'));
        this._start = parseInt(this.getAttribute('start')) || 1;
        this._end = parseInt(this.getAttribute('end')) || this._length;
        this._highlightStart = parseInt(this.getAttribute('highlightStart'));
        this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
        this._height = 430;
        this._width = this.getAttribute('width') ? parseInt(this.getAttribute('width')) : 700;
        this._margin = {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10
        }
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    static get observedAttributes() {
        return ['start', 'end', 'highlightStart', 'highlightEnd', 'width'];
    }

    connectedCallback() {
        this.addEventListener('load', d => this.render(d.detail.payload));
        // this.render();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {}

    render(data) {
        const yScale = d3.scalePoint()
            .domain(aaList)
            .range([0, this._height - this._margin.top - this._margin.bottom]);

        const svg = d3.select(this).append('svg')
            .attr('width', this._width)
            .attr('height', this._height);

        // const variationPlot = this.getVariationPlot();

        // // Data series
        // var series = variationPlot()
        //     .xScale(variantViewer.xScale)
        //     .yScale(variantViewer.yScale);

        // var dataSeries = createDataSeries(fv, variantViewer, svg, features, series);

        // this.update = function() {
        //     dataSeries.call(series);
        //     if (fv.selectedFeature) {
        //         ViewerHelper.updateHighlight(fv);
        //     } else if (fv.highlight) {
        //         ViewerHelper.updateHighlight(fv);
        //     }
        // };

        // this.updateData = function(data) {
        //     dataSeries.datum(data);
        //     this.update();
        // };

    }

    update() {}
}

export default ProtvistaVariation;