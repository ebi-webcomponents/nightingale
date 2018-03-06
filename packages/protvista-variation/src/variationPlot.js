import {select, scalePow} from 'd3';
import VariantColour from './variantColour';
class VariationPlot {

    constructor(xScale, yScale, length) {
        this._length = length;
        this._xScale = xScale;
        this._yScale = yScale;
        // Scale for opacity of dots based on frequency
        this._frequency = scalePow()
            .exponent(0.001)
            .domain([0, 1])
            .range([5, 10]);
        // Data bind otherwise babel removes it
        this.drawVariationPlot = this
            .drawVariationPlot
            .bind(this);
    }

    set xScale(xScale) {
        this._xScale = xScale;
    }

    get xScale() {
        return this._xScale;
    }

    set yScale(yScale) {
        this._yScale = yScale;
    }

    set length(length) {
        this._length = length;
    }

    drawVariationPlot(selection) {
        // Iterate over data
        selection.each((data, i, nodes) => {
            // Generate chart
            const series = select(nodes[i]);

            // ????
            const withVariants = data.filter(elem => elem.variants.length !== 0);

            // bind data
            const bars = series
                .selectAll('g')
                .data(withVariants, d => d.pos);

            bars
                .exit()
                .remove();

            // On enter append for each data point
            const circle = bars
                .enter()
                .append('g')
                .merge(bars)
                .selectAll('circle')
                .data(d => d.variants);

            circle
                .exit()
                .remove();

            circle
                .enter()
                .append('circle')
                .merge(circle)
                .attr('class', function (d) {
                    // if (d === fv.selectedFeature) {     return 'up_pftv_variant
                    // up_pftv_activeFeature'; } else {     return 'up_pftv_variant'; }
                })
                .attr('title', d => d.begin)
                .attr('r', 5)
                .attr('cx', d => {
                    return this._xScale(Math.min(d.begin, this._length))
                })
                .attr('cy', d => {
                    return this._yScale(d.alternativeSequence.charAt(0))
                })
                .attr('name', d => {
                    var mutation = d.alternativeSequence === '*'
                        ? 'STOP'
                        : d.alternativeSequence;
                    d.internalId = 'var_' + d.wildType + d.begin + mutation;
                    return d.internalId;
                })
                .attr('fill', d => VariantColour.getColour(d))
                .attr('stroke', d => {
                    if (d.externalData) {
                        var keys = _.keys(d.externalData);
                        var extDatum = d.externalData[keys[0]];
                        if (extDatum.consequence) {
                            var pos = Constants
                                .getConsequenceTypes()
                                .indexOf(extDatum.consequence);
                            return pos !== -1
                                ? LegendDialog.consequenceColors[pos % LegendDialog.consequenceColors.length]
                                : 'black';
                        } else {
                            return 'black';
                        }
                    } else {
                        return 'none';
                    }
                });

            // ViewerHelper.addEventsClassAndTitle(catTitle, newCircles, fv, container);
        });
    }
}

export default VariationPlot;