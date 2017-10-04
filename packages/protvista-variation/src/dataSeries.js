createDataSeries(fv, variantViewer, svg, features, series) {

    // Group for the main chart
    var mainChart = svg.append('g')
        .attr('transform', 'translate(0,' + variantViewer.margin.top + ')');

    // clip path prevents drawing outside of it
    var chartArea = mainChart.append('g')
        .attr('clip-path', 'url(#plotAreaClip)');

    mainChart.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: (variantViewer.width - 20), height: variantViewer.height })
        .attr('transform', 'translate(10, -10)');

    // This is calling the data series render code for each of the items in the data
    var dataSeries = chartArea
        .datum(features)
        .call(series);

    // This is the AA axis on left
    var yAxis = d3.axisLeft()
        .scale(variantViewer.yScale)
        .tickSize(-variantViewer.width);

    // This is the AA axis on right
    var yAxis2 = d3.axisRight()
        .scale(variantViewer.yScale);

    // Adding AA axis left
    mainChart.append('g')
        .attr('transform', 'translate(12 ,0)')
        .attr('class', 'variation-y axis')
        .call(yAxis);

    // Adding AA axis right
    mainChart.append('g')
        .attr('transform', 'translate(' + (variantViewer.width - 18) + ', 0)')
        .attr('class', 'variation-y axis')
        .call(yAxis2);

    // ???
    fv.globalContainer.selectAll('g.variation-y g.tick').attr('class', function(d) {
        return 'tick up_pftv_aa_' + (d === '*' ? 'loss' : d === 'del' ? 'deletion' : d);
    });

    return dataSeries;
};