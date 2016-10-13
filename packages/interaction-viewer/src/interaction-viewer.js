const d3 = require('d3');
const sparqlLoader = require('./sparqlLoader');
const _ = require('underscore');

const filters = [{
  name: 'Disease',
  value: 'disease',
  filter: false
}, {
  name: 'Subcellular location',
  value: 'subcell',
  filter: false
}];

module.exports.render = function({
  el = required('el'),
  accession = 'P05067'
}) {
  // clear all previous vis
  d3.select(el).select('svg').remove();
  d3.select(el).select('.interaction-tooltip').remove();

  sparqlLoader.loadData(accession).then(data => {
    let nodes = data.nodes,
      links = data.links;

    order(data);

    var tooltip = d3.select(el).append("div")
      .attr("class", "interaction-tooltip")
      .style("opacity", 0);

    const margin = {
        top: 100,
        right: 0,
        bottom: 10,
        left: 100
      },
      width = height = 18 * nodes.length;

    const x = d3.scale.ordinal().rangeBands([0, width]),
      intensity = d3.scale.linear().range([0.2, 1]);

    const svg = d3.select(el).append("svg")
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

    // left axis text
    row.append("text")
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text((d, i) => nodes[i].entryName)
      .attr('class', (d,i) => (nodes[i].accession === accession)? "main-accession" : "");

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

    // top axis text
    column.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text((d, i) => nodes[i].entryName)
      .attr('class', (d,i) => (nodes[i].accession === accession)? "main-accession" : "");


    function processRow(row) {
      const filtered = links.filter(d => d.source === row.accession);

      var cell = d3.select(this).selectAll(".cell")
        .data(filtered);

      var circle = cell.enter().append("circle");

      circle.attr("class", "cell")
        .attr("cx", d => {
          return x(d.target) + x.rangeBand() / 2
        })
        .attr("cy", d => x.rangeBand() / 2)
        .attr("r", x.rangeBand() / 3)
        .style("fill-opacity", d => intensity(d.experiments))
        .on("click", mouseover);
        // .on("mouseout", mouseout);

      cell.exit().remove();
    }

    function mouseover(p) {
      d3.select(this).classed("active-cell", true);
      d3.selectAll(".row").classed("active", d => d.accession === p.source);
      d3.selectAll(".column").classed("active", d => d.accession === p.target);
      tooltip.html(`<a href="#" class="close-interaction-tooltip">Close x</a><a href="//uniprot.org/uniprot/${p.source}">${p.source}</a> - <a href="//uniprot.org/uniprot/${p.target}">${p.target}</a><br/>
      ${p.experiments} experiment(s)`);
      tooltip.style("opacity", .9)
        .style("visibility", "visible")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");
    }

    function mouseout() {
      d3.selectAll("g").classed("active", false);
      d3.selectAll("circle").classed("active-cell", false);
    }

    function order(data) {
      // Always place the query accession at the top
      data.nodes.splice(0, 0, data.nodes.splice(_.pluck(data.nodes, 'accession').lastIndexOf(accession), 1)[0]);
    }
    createFilter(el);

    d3.selectAll('.close-interaction-tooltip').on("click", function(){
      console.log('here');
      d3.selectAll('.interaction-tooltip')
        .style("opacity", 0)
        .style("visibility", "hidden");
    });

  });
}

function filter(_filter) {
  toggle(_filter);
  let visible = _.filter(filters, d => d.visible);
  const hide = [];
  d3.selectAll('text')
    .attr('opacity', d => {
      let show = _.every(visible, filter => {
        return d[filter.value];
      });
      if(!show) {
        hide.push(d.accession);
      }
      return show ? 1 : .1;
    });

  d3.selectAll('.cell')
    .attr('opacity', d => {
      return (_.contains(hide, d.source) || _.contains(hide, d.target)) ? .1 :1;
    })
}

function toggle(_filter) {
  var match = _.find(filters, d => _filter === d.value);
  match.visible = match.visible ? false : true
}

function createFilter(el) {
  d3.select(el).selectAll(".interaction-filter").remove();
  const container = d3.select(el).append("div")
    .attr("class", "interaction-filter");

  container.append("h4").text('Filter annotation:');

  var listItem = container.append("ul")
    .selectAll('li')
    .data(filters)
    .enter()
    .append('li');

  listItem.append('input')
    .attr('type', 'checkbox')
    .attr('id', d => d.value)
    .property('checked', d => {
      return d.filter;
    })
    .on('click', d => filter(d.value));

  listItem.append('label')
    .text(d => `Has ${d.name.toLowerCase()}`)
    .attr('for', d => d.value);
}

function required(name) {
  throw Error(`missing option: ${name}`);
}
