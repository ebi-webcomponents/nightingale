import * as d3 from 'd3';
import {zoom as d3Zoom} from 'd3-zoom';
import {processVariants} from './dataTransformer';
import VariationPlot from './variationPlot';
import ProtvistaVariationFilters from './filters'

const aaList = [
    'G',
    'A',
    'V',
    'L',
    'I',
    'S',
    'T',
    'C',
    'M',
    'D',
    'N',
    'E',
    'Q',
    'R',
    'K',
    'H',
    'F',
    'Y',
    'W',
    'P',
    'd',
    '*'
];

class ProtvistaVariation extends HTMLElement {

    constructor() {
        super();
        this._accession = this.getAttribute('accession');
        this._length = parseInt(this.getAttribute('length'));
        this._highlightStart = parseInt(this.getAttribute('highlightStart'));
        this._highlightEnd = parseInt(this.getAttribute('highlightEnd'));
        this._height = 430;
        this._width = this.getAttribute('width')
            ? parseInt(this.getAttribute('width'))
            : 700;
        this._margin = {
            top: 20,
            right: 10,
            bottom: 10,
            left: 10
        }
        this._xScale = d3.scaleOrdinal();
        this._yScale = d3.scaleLinear();

        this.renderChart = this
            .renderChart
            .bind(this);
        this.createDataSeries = this
            .createDataSeries
            .bind(this);
        this.zoomed = this
            .zoomed
            .bind(this);
        this.refresh = this
            .refresh
            .bind(this);
        this.attributeChangedCallback = this
            .attributeChangedCallback
            .bind(this);

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
        <style>
        :host {
            display: block;
        }
        .filters-container {
            display:inline-flex;
        }
        circle {
            opacity: 0.6;
        }
        circle:hover {
            opacity: 0.9;
        }
        .tick line, .axis path {
            opacity: 0.1;
        }
        </style>
        <slot></slot>
        `;
    }

    get start() {
        return this.getAttribute('start');
    }

    set start(start) {
        if (start !== this.getAttribute('start')) {
            this.setAttribute('start', start);
        }
    }

    get scale() {
        return this.getAttribute('scale');
    }

    set scale(scale) {
        if (scale !== this.getAttribute('scale')) {
            this.setAttribute('scale', scale);
        }
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    static get observedAttributes() {
        return ['start', 'scale', 'highlightStart', 'highlightEnd', 'width'];
    }

    connectedCallback() {
        const filtercontainer = document.createElement('protvista-variation-filters');
        // filtercontainer.addClass('filters-container');
        this
            .shadowRoot
            .appendChild(filtercontainer);
        // filtercontainer(filtercontainer);
        this.addEventListener('load', d => {
            this._length = d.detail.payload.sequence.length;
            this._data = processVariants(d.detail.payload.features, d.detail.payload.sequence)
            this.renderChart();
            if (this.start && this.scale) {
                this.applyZoomTranslation();
                this.refresh();
            }
            // this.updateData(filters.consequenceFilters[0].filter(this._data));
        });
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (!this._svg) {
            return;
        }
        switch (attrName) {
            case 'start':
                this.applyZoomTranslation();
                break;
            case 'scale':
                this.applyZoomTranslation();
                break;
        }
    }

    applyZoomTranslation() {
        this
            ._svg
            .transition()
            .duration(300)
            .call(this._zoom.transform, d3.zoomIdentity.translate((-(this._xScale(this.start) * this.scale) + this._margin.left), 0).scale(this.scale));
    }

    testThing() {
        console.log('thing');
    }

    renderChart() {
        this._xScale = d3
            .scaleLinear()
            .domain([
                1, this._length + 1
            ])
            .range([
                this._margin.left, this._width - this._margin.right
            ]);

        // scale for Amino Acids
        this._yScale = d3
            .scalePoint()
            .domain(aaList)
            .range([
                0, this._height - this._margin.top - this._margin.bottom
            ]);

        // xScale is the one about position
        this._zoom = d3Zoom()
            .scaleExtent([1, 40])
            .translateExtent([
                [
                    0, 0
                ],
                [this._width, this._height]
            ])
            .on("zoom", this.zoomed);

        // Create the SVG
        this._svg = d3
            .select(this.shadowRoot)
            .append('svg')
            .attr('width', this._width)
            .attr('height', this._height);

        // create the variation plot function to be called by the series?
        const variationPlot = new VariationPlot(this._xScale, this._yScale, this._length);

        // Not sure what happens here, but it seems to set the scales on the variation
        // plot var series =
        variationPlot.xScale = this._xScale;
        variationPlot.yScale = this._yScale;

        this._variationPlot = variationPlot;

        // Create the visualisation here
        this.createDataSeries(this._svg, this._data);
        this
            ._svg
            .call(this._zoom);
    }

    zoomed() {
        this._variationPlot.xScale = d3
            .event
            .transform
            .rescaleX(this._xScale);
        this.refresh();
    }

    createDataSeries(svg, features, series) {

        // Group for the main chart
        var mainChart = svg
            .append('g')
            .attr('transform', 'translate(0,' + this._margin.top + ')');

        // clip path prevents drawing outside of it
        var chartArea = mainChart
            .append('g')
            .attr('clip-path', 'url(#plotAreaClip)');

        mainChart
            .append('clipPath')
            .attr('id', 'plotAreaClip')
            .append('rect')
            .attr('width', (this._width - 20))
            .attr('height', this._height)
            .attr('transform', 'translate(10, -10)');

        // This is calling the data series render code for each of the items in the data
        var dataSeries = chartArea
            .datum(features)
            .call(this._variationPlot.drawVariationPlot);

        // This is the AA axis on left
        var yAxis = d3
            .axisLeft()
            .scale(this._yScale)
            .tickSize(-this._width);

        // This is the AA axis on right
        var yAxis2 = d3
            .axisRight()
            .scale(this._yScale);

        // Adding AA axis left
        mainChart
            .append('g')
            .attr('transform', 'translate(12 ,0)')
            .attr('class', 'variation-y axis')
            .call(yAxis);

        // Adding AA axis right
        mainChart
            .append('g')
            .attr('transform', 'translate(' + (this._width - 18) + ', 0)')
            .attr('class', 'variation-y axis')
            .call(yAxis2);

        // ??? fv.globalContainer.selectAll('g.variation-y g.tick').attr('class',
        // function(d) {     return 'tick up_pftv_aa_' + (d === '*' ? 'loss' : d ===
        // 'del' ? 'deletion' : d); });

        this._series = dataSeries;
    }

    // Calling render again (after xScale has changed)
    refresh() {
        this
            ._series
            .call(this._variationPlot.drawVariationPlot);
    }

    reset() {
        // reset zoom, filter and any selections
    }

    // Calling render again with new data (after filter was used???)
    updateData(data) {
        this
            ._series
            .datum(data);
        this.refresh();
    };
}

export default ProtvistaVariation;