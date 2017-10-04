getVariationPlot() {
    var xScale = d3.scaleOrdinal(),
        yScale = d3.scaleLinear();

    // Scale for opacity of dots based on frequency
    var frequency = d3.scalePow()
        .exponent(0.001)
        .domain([0, 1])
        .range([5, 10]);

    var variationPlot = function(selection) {
        var series, bars;

        // Iterate over data
        selection.each(function(data) {
            // Generate chart
            series = d3.select(this);

            // ????
            var withVariants = _.filter(data, function(elem) {
                return elem.variants.length !== 0;
            });

            // bind data
            bars = series.selectAll('.up_pftv_var-series')
                .data(withVariants, function(d) {
                    return d.pos;
                });

            // On enter append for each data point
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

var drawVariants = function(variantViewer, bars, frequency, fv, container, catTitle) {
    var variantCircle = bars.selectAll('circle')
        .data(function(d) {
            return d.variants;
        });

    var newCircles = variantCircle.enter().append('circle')
        .attr('r', function(d) {
            return frequency(0);
        });

    variantCircle
        .attr('class', function(d) {
            if (d === fv.selectedFeature) {
                return 'up_pftv_variant up_pftv_activeFeature';
            } else {
                return 'up_pftv_variant';
            }
        })
        .attr('cx', function(d) {
            return variantViewer.xScale(Math.min(d.begin, fv.sequence.length));
        })
        .attr('cy', function(d) {
            return variantViewer.yScale(d.alternativeSequence.charAt(0));
        })
        .attr('name', function(d) {
            var mutation = d.alternativeSequence === '*' ? 'STOP' :
                d.alternativeSequence;
            d.internalId = 'var_' + d.wildType + d.begin + mutation;
            return d.internalId;
        })
        .attr('fill', function(d) {
            return variantsFill(d, fv);
        })
        .attr('stroke', function(d) {
            if (d.externalData) {
                var keys = _.keys(d.externalData);
                var extDatum = d.externalData[keys[0]];
                if (extDatum.consequence) {
                    var pos = Constants.getConsequenceTypes().indexOf(extDatum.consequence);
                    return pos !== -1 ? LegendDialog.consequenceColors[pos % LegendDialog.consequenceColors.length] : 'black';
                } else {
                    return 'black';
                }
            } else {
                return 'none';
            }
        });

    ViewerHelper.addEventsClassAndTitle(catTitle, newCircles, fv, container);
    variantCircle.exit().remove();
};