import {
    select,
    scalePow,
    event as d3Event
} from 'd3';
import VariantColour from './variantColour';
class VariationPlot {

    constructor() {
        this._frequency = scalePow()
            .exponent(0.001)
            .domain([0, 1])
            .range([5, 10]);
        // Data bind otherwise babel removes it
        this.drawVariationPlot = this
            .drawVariationPlot
            .bind(this);
    }

    drawVariationPlot(selection, element) {
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
                    return element._xScale(Math.min(d.begin, element._length))
                })
                .attr('cy', d => {
                    return element._yScale(d.alternativeSequence.charAt(0))
                })
                .attr('name', d => {
                    var mutation = d.alternativeSequence === '*' ?
                        'STOP' :
                        d.alternativeSequence;
                    d.internalId = 'var_' + d.wildType + d.begin + mutation;
                    return d.internalId;
                })
                .attr('fill', d => VariantColour.getColour(d))
                .attr('tooltip-trigger', 'true')
                .attr('stroke', d => {
                    if (d.externalData) {
                        var keys = _.keys(d.externalData);
                        var extDatum = d.externalData[keys[0]];
                        if (extDatum.consequence) {
                            var pos = Constants
                                .getConsequenceTypes()
                                .indexOf(extDatum.consequence);
                            return pos !== -1 ?
                                LegendDialog.consequenceColors[pos % LegendDialog.consequenceColors.length] :
                                'black';
                        } else {
                            return 'black';
                        }
                    } else {
                        return 'none';
                    }
                })
                .on('mouseover', f => {
                    element.dispatchEvent(new CustomEvent("change", {
                        detail: {
                            highlightend: f.end,
                            highlightstart: f.start
                        },
                        bubbles: true,
                        cancelable: true
                    }));
                })
                .on('click', d => {
                    element.createTooltip(d3Event, d, true);
                });
        });
    }
}

export default VariationPlot;