getVariationPlot() {
    var xScale = d3.scaleOrdinal(),
        yScale = d3.scaleLinear();

    var frequency = d3.scalePow()
        .exponent(0.001)
        .domain([0, 1])
        .range([5, 10]);

    var variationPlot = function(selection) {
        var series, bars;

        selection.each(function(data) {
            // Generate chart
            series = d3.select(this);

            var withVariants = _.filter(data, function(elem) {
                return elem.variants.length !== 0;
            });

            bars = series.selectAll('.up_pftv_var-series')
                .data(withVariants, function(d) {
                    return d.pos;
                });

            bars.enter()
                .append('g')
                .transition()
                .duration(250)
                .attr('class', 'up_pftv_var-series');

            drawVariants(variantViewer, bars, frequency, fv, container, catTitle);
            bars.exit().transition().duration(250).remove();
        });
    };

    variationPlot.xScale = function(value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return variationPlot;
    };

    variationPlot.yScale = function(value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return variationPlot;
    };

    return variationPlot;
}