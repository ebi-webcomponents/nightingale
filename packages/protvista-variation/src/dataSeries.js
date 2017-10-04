createDataSeries(fv, variantViewer, svg, features, series) {
    var mainChart = svg.append('g')
        .attr('transform', 'translate(0,' + variantViewer.margin.top + ')');

    var chartArea = mainChart.append('g')
        .attr('clip-path', 'url(#plotAreaClip)');

    mainChart.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: (variantViewer.width - 20), height: variantViewer.height })
        .attr('transform', 'translate(10, -10)');

    var dataSeries = chartArea
        .datum(features)
        .call(series);

    var yAxis = d3.axisLeft()
        .scale(variantViewer.yScale)
        .tickSize(-variantViewer.width);

    var yAxis2 = d3.axisRight()
        .scale(variantViewer.yScale);

    mainChart.append('g')
        .attr('transform', 'translate(12 ,0)')
        .attr('class', 'variation-y axis')
        .call(yAxis);

    mainChart.append('g')
        .attr('transform', 'translate(' + (variantViewer.width - 18) + ', 0)')
        .attr('class', 'variation-y axis')
        .call(yAxis2);

    fv.globalContainer.selectAll('g.variation-y g.tick').attr('class', function(d) {
        return 'tick up_pftv_aa_' + (d === '*' ? 'loss' : d === 'del' ? 'deletion' : d);
    });

    return dataSeries;
};