const d3 = require('d3');
const sparqlLoader = require('./sparqlLoader');

sparqlLoader.loadData('P04637').then(data => {
  let nodes = data.nodes,
    links = data.links;

  const margin = {
      top: 100,
      right: 0,
      bottom: 10,
      left: 100
    },
    width = height = 15 * nodes.length;

  const x = d3.scale.ordinal().rangeBands([0, width]),
    intensity = d3.scale.linear().range([0.2, 1]);

  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "interaction-viewer")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(nodes.map(entry => entry.accession));
  intensity.domain([0, d3.max(links.map(link => link.experiments))]);

  const row = svg.selectAll(".row")
    .data(nodes)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", d => `translate(0,${x(d.accession)})`)
    .each(processRow);

  row.append("rect")
    .attr("x", -margin.left)
    .attr("width", margin.left)
    .attr("height", x.rangeBand())
    .attr("class", "text-highlight");

  row.append("text")
    .attr("y", x.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "end")
    .text((d, i) => nodes[i].entryName);

  const column = svg.selectAll(".column")
    .data(nodes)
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", d => `translate(${x(d.accession)}, 0)rotate(-90)`);

  column.append("rect")
    .attr("x", 6)
    .attr("width", margin.top)
    .attr("height", x.rangeBand())
    .attr("class", "text-highlight");

  column.append("text")
    .attr("x", 6)
    .attr("y", x.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .text((d, i) => nodes[i].entryName);

  function processRow(row) {
    const filtered = links.filter(d => d.source === row.accession);

    var cell = d3.select(this).selectAll(".cell")
      .data(filtered)
      .enter().append("circle")
      .attr("class", "cell")
      .attr("cx", d => {
        return x(d.target) + x.rangeBand() / 2
      })
      .attr("cy", d => x.rangeBand() / 2)
      .attr("r", x.rangeBand() / 4)
      .style("fill-opacity", d => intensity(d.experiments))
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);
  }

  function mouseover(p) {
    d3.select(this).classed("active-cell", true);
    d3.selectAll(".row").classed("active", d => d.accession === p.source);
    d3.selectAll(".column").classed("active", d => d.accession === p.target);
  }

  function mouseout() {
    d3.selectAll("g").classed("active", false);
    d3.selectAll("circle").classed("active-cell", false);
  }

  function order() {

  }

  function filter() {

  }

});
