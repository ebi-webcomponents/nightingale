const d3 = require('d3');
const margin = {
    top: 80,
    right: 0,
    bottom: 10,
    left: 80
  },
  width = height = 720;

const x = d3.scale.ordinal().rangeBands([0, width]),
      intensity = d3.scale.linear().domain([0,10]).range([0.2,1]);

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "interaction-viewer")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json('data/interaction_v1.json', data => {
  let nodes = data.nodes,
    links = data.links;

  x.domain(nodes.map(entry => entry.accession));

  svg.append("rect")
    .attr("class", "interaction-background")
    .attr("width", width)
    .attr("height", height);

  const row = svg.selectAll(".row")
    .data(nodes)
    .enter().append("g")
    .attr("class", "row")
    .attr("transform", d => `translate(0,${x(d.accession)})`)
    .each(processRow);

  row.append("line")
    .attr("x2", width);

  row.append("text")
    // .attr("x", -6)
    .attr("y", x.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "end")
    .text((d, i) => nodes[i].entryName);

  const column = svg.selectAll(".column")
    .data(nodes)
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", d => `translate(${x(d.accession)}, 0)rotate(-90)`);

  column.append("line")
    .attr("x1", -width);

  column.append("text")
    .attr("x", 6)
    .attr("y", x.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .text((d, i) => nodes[i].entryName);

  function processRow(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(links.filter(function(d) {
          return d.source === row.accession;
        }))
      .enter().append("circle")
        .attr("class", "cell")
        .attr("cx", function(d) {
          return x(d.target) - x.rangeBand()/2;
        })
        .attr("cy", d => x.rangeBand()/2)
        .attr("r", x.rangeBand() / 4 )
        .style("fill-opacity", d => intensity(d.experiments));
        // .on("mouseover", mouseover)
        // .on("mouseout", mouseout);

  }

});
