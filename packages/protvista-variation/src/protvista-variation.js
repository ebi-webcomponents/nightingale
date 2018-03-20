import ProtVistaTrack from "protvista-track";
import {
    scaleLinear,
    scalePoint,
    axisLeft,
    axisRight,
    select,
    event as d3Event
} from 'd3';
import {
    processVariants
} from './dataTransformer';
import VariationPlot from './variationPlot';
import {
    getFiltersFromAttribute
} from './filters';
import cloneDeep from 'lodash-es/cloneDeep';
import union from 'lodash-es/union';
import '../style/protvista-variation.css';

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

class ProtvistaVariation extends ProtVistaTrack {

    static get observedAttributes() {
        return ProtVistaTrack.observedAttributes.concat(['variantfilters']);
    }

    connectedCallback() {
        super.connectedCallback();
        this._accession = this.getAttribute('accession');
        this._height = parseInt(this.getAttribute('height')) ?
            parseInt(this.getAttribute('height')) :
            430;
        this._width = this._width ? this._width : 0;
        this._selectedFilters = getFiltersFromAttribute(this.getAttribute('variantfilters'));
        this._margin = {
            top: 20,
            bottom: 10
        }
        this._yScale = scaleLinear();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
        if (!super.svg) {
            return;
        }
        switch (attrName) {
            case 'variantfilters':
                if (newVal !== oldVal) {
                    this._selectedFilters = getFiltersFromAttribute(this.getAttribute('variantfilters'));
                    this.applyFilters();
                }
        }
    }

    set data(data) {
        this._data = processVariants(data.features, data.sequence);
        this._createTrack();
        if (this._selectedFilters)
            this.applyFilters();
    }

    _createTrack() {
        super.svg = select(this)
            .append('svg')
            .attr('width', '100%')
            .attr('height', this._height);

        // scale for Amino Acids
        this._yScale =
            scalePoint()
            .domain(aaList)
            .range([
                0, this._height - this._margin.top - this._margin.bottom
            ]);

        // create the variation plot function to be called by the series?
        this._variationPlot = new VariationPlot();

        // Create the visualisation here
        this._createFeatures();
        this.refresh();
    }

    _createFeatures() {
        // Group for the main chart
        const mainChart = super.svg
            .append('g')
            .attr('transform', 'translate(0,' + this._margin.top + ')');

        // clip path prevents drawing outside of it
        const chartArea = mainChart
            .append('g')
            .attr('clip-path', 'url(#plotAreaClip)');

        this._clipPath = mainChart
            .append('clipPath')
            .attr('id', 'plotAreaClip')
            .append('rect')
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('transform', 'translate(10, -10)');

        // This is calling the data series render code for each of the items in the data
        this._series = chartArea
            .datum(this._data);

        this._axisLeft = mainChart
            .append('g');

        this._axisRight = mainChart
            .append('g');

        this.updateScale();
        // ??? fv.globalContainer.selectAll('g.variation-y g.tick').attr('class',
        // function(d) {     return 'tick up_pftv_aa_' + (d === '*' ? 'loss' : d ===
        // 'del' ? 'deletion' : d); });
    }

    // Calling render again
    refresh() {
        if (this._series) {
            // this._variationPlot.xScale = super.xScale;
            this._clipPath.attr('width', this._width);
            this.updateScale();
            this
                ._series
                .call(this._variationPlot.drawVariationPlot, this);
        }
    }

    updateScale() {
        this._yAxisLScale =
            axisLeft()
            .scale(this._yScale)
            .tickSize(-this._width);

        this._yAxisRScale =
            axisRight()
            .scale(this._yScale);

        this._axisLeft
            .attr('transform', 'translate(12 ,0)')
            .attr('class', 'variation-y axis')
            .call(this._yAxisLScale);

        this._axisRight
            .attr('transform', 'translate(' + (this._width - 18) + ', 0)')
            .attr('class', 'variation-y axis')
            .call(this._yAxisRScale);
    }

    // Calling render again with new data (after filter was used)
    updateData(data) {
        if (this._series) {
            this
                ._series
                .datum(data);
            this.refresh();
        }
    }


    reset() {
        // reset zoom, filter and any selections
    }

    applyFilters() {
        let filteredData = [];
        if (this._selectedFilters.length <= 0) {
            this.updateData(this._data);
            return;
        }
        this._selectedFilters.forEach(f => {
            filteredData = union(f.applyFilter(this._data), filteredData);
        });
        this.updateData(filteredData);
    }

}

export default ProtvistaVariation;