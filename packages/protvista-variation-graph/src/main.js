import ProtVistaTrack from 'protvista-track';
import {
    scaleLinear,
    scalePoint,
    axisLeft,
    axisRight,
    select,
    event as d3Event,
    line,
    extent,
    max,
    curveBasis
} from 'd3';

const loadComponent = function() {
    class ProtvistaVariationGraph extends ProtVistaTrack {

        constructor() {
            super();
        }

        connectedCallback() {
            super.connectedCallback();

            this._data = undefined;

            this._margin = {
                top: 20,
                bottom: 10,
                right: 10,
                left: 10
            }

            this._height = parseInt(this.getAttribute('height')) || 60;
            this._width = parseInt(this.getAttribute('width')) || 800;
// console.log("++ w/h:", this._width, this._height);
            // const bbox = select(this).node().getBoundingClientRect();
            // console.log("bbox:", bbox);
            // this._width = bbox.width;
            // this._height = bbox.height;

            this._xScale = scaleLinear();
            this._yScale = scaleLinear();
            this._xExtent;
            this._yExtent;

            this._totals_line = line()
                .x(d => this._xScale(d.x))
                .y(d => this._yScale(d.y))
                .curve(curveBasis);

            this._totals_dataset = {};

            this._disease_line = line()
                .x(d => this._xScale(d.x))
                .y(d => this._yScale(d.y))
                .curve(curveBasis);

            this._disease_dataset = {};

            this._non_disease_line = line()
                .x(d => this._xScale(d.x))
                .y(d => this._yScale(d.y))
                .curve(curveBasis);

            this._non_disease_dataset = {};
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            // super.attributeChangedCallback(attrName, oldVal, newVal);
            console.log('attr changed:', attrName, oldVal, newVal);
        }

        set data(data) {
            console.log('data:', data);
            // this._data = this.normalizeLocations(data);
            this._data = data;

            this._data.features
                .forEach(r => {
                    if ('undefined' === typeof this._totals_dataset[r.begin]) {
                        this._totals_dataset[r.begin] = 0;
                    }

                    if ('undefined' === typeof this._disease_dataset[r.begin]) {
                        this._disease_dataset[r.begin] = 0;
                    }

                    if ('undefined' === typeof this._non_disease_dataset[r.begin]) {
                        this._non_disease_dataset[r.begin] = 0;
                    }

                    this._totals_dataset[r.begin]++;

                    if ('undefined' !== typeof r.association) {
                        r.association
                            .forEach(a => {
// console.log("disease:", a);
                                if (true === a.disease) {
                                    this._disease_dataset[r.begin]++;
                                }

                                else if (false === a.disease) {
                                    this._non_disease_dataset[r.begin]++;
                                }
                            })
                    }
                });

            this._totals_dataset = this._emptyFillMissingRecords(this._totals_dataset);
            this._disease_dataset = this._emptyFillMissingRecords(this._disease_dataset);
            this._non_disease_dataset = this._emptyFillMissingRecords(this._non_disease_dataset);

            // const sortedDiseases = Object.keys(this._disease_dataset)
            //     .map(k => parseInt(k))
            //     .sort((a, b) => a - b)
            //     .map(k => ({
            //         x: k,
            //         y: this._disease_dataset[k]
            //     }));

            // this._disease_dataset = sortedDiseases;
            
            // console.log('TOTALS:', this._totals_dataset);
            // console.log('DISEASES:', this._disease_dataset);
            // console.log("NON-DISEASE:", this._non_disease_dataset);

            this._createTrack();
        }

        _emptyFillMissingRecords(dataset) {
            const sortedTotalsKeys = Object.keys(dataset)
                .sort((a, b) => parseInt(a) - parseInt(b));

            const totalsMin = sortedTotalsKeys[0];
            const totalsMax = sortedTotalsKeys[sortedTotalsKeys.length - 1];

            for (let i = totalsMin; i < totalsMax; i++) {
                if ('undefined' === typeof dataset[i]) {
                    dataset[i] = 0;
                }
            }

            return Object.keys(dataset)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(k => ({
                    x: k,
                    y: dataset[k]
                }));
        }

        _createTrack() {
            super.svg = select(this)
                .append('svg')
                // .attr('width', this._width + this._margin.left + this._margin.right)
                .attr('height', this._height + this._margin.top + this._margin.bottom)
                .attr('width', this._width)
                // .attr('height', this._height)
                // .append('g')
                //     .attr('transform', `translate(${this._margin.top},${this._margin.left})`);
                .append('g')
                    .attr('transform', 'translate(0, 20)');

            super.svg.append('rect')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('fill', 'white')
                .attr('stroke-width', '1')
                .attr('stroke', 'grey')
                // .attr('transform', `translate(0,0)`);

            // Create the visualisation here
            this._createFeatures();
        }

        _createFeatures() {

            this._xExtent = extent(this._totals_dataset, d => parseInt(d.x));
            this._yExtent = extent(this._totals_dataset, d => d.y);

//             const bbox = select(this).node().getBoundingClientRect();
// console.log("bbox:", bbox);
console.log("width/height:", this._width, this._height);
            this._xScale.domain(this._xExtent)
                .range([0, this._width]);
            this._yScale.domain(this._yExtent)
                .range([this._height, 0]);

            super.svg
                .append('path')
                .data([this._disease_dataset])
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('stroke-width', '1.5px')
                .attr('stroke-dasharray', '0')
                .attr('d', this._disease_line);

            // super.svg
            //     .append('path')
            //     .data([this._non_disease_dataset])
            //     .attr('fill', 'none')
            //     .attr('stroke', 'yellow')
            //     .attr('stroke-width', '1.5px')
            //     .attr('stroke-dasharray', '0')
            //     .attr('d', this._non_disease_line);

            super.svg
                .append('path')
                .data([this._totals_dataset])
                .attr('fill', 'none')
                .attr('stroke', 'darkgrey')
                .attr('stroke-width', '1px')
                .attr('stroke-dasharray', '.5')
                .attr('d', this._totals_line);
        }

        updateScale() {
            
        }

    }
    customElements.define('protvista-variation-graph', ProtvistaVariationGraph);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function() {
        loadComponent();
    });
}
