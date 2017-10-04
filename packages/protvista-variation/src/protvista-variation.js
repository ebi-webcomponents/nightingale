import * as d3 from 'd3';
import { processVariants } from './dataTransformer';

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
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
        <style>
        :host {
            display: block;
        }
        </style>
        <slot></slot>
        `;
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
        processVariants(data.features, data.sequence);
        const xScale = d3.scaleLinear()
            .domain([1, this._length + 1])
            .range([this._margin.left, this._width - this._margin.right]);

        // scale for Amino Acids
        const yScale = d3.scalePoint()
            .domain(aaList)
            .range([0, this._height - this._margin.top - this._margin.bottom]);

        // xScale is the one about position

        // Create the SVG
        const svg = d3.select(this.shadowRoot).append('svg')
            .attr('width', this._width)
            .attr('height', this._height);

        // const variationPlot = this.getVariationPlot();

        // Not sure what happens here, but it seems to set the scales on the variation plot
        var series = variationPlot()
            .xScale(variantViewer.xScale)
            .yScale(variantViewer.yScale);

        // Create the visualisation here
        var dataSeries = createDataSeries(fv, variantViewer, svg, features, series);

        // Calling render again (after xScale has changed)
        this.update = function() {
            dataSeries.call(series);
            if (fv.selectedFeature) {
                ViewerHelper.updateHighlight(fv);
            } else if (fv.highlight) {
                ViewerHelper.updateHighlight(fv);
            }
        };

        // Calling render again with new data (after filter was used???)
        this.updateData = function(data) {
            dataSeries.datum(data);
            this.update();
        };

    }

    update() {}
}

export default ProtvistaVariation;