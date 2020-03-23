import { select, selectAll, mouse } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";

function drawAdjacencyGraph(el, accession, data, filters) {
  const nodes = data;

  const tooltip = select(el)
    .append("div")
    .attr("class", "interaction-tooltip")
    .style("display", "none")
    .style("opacity", 0);
  tooltip
    .append("span")
    .attr("class", "close-interaction-tooltip")
    .text("Close ✖")
    .on("click", closeTooltip);
  tooltip.append("div").attr("class", "tooltip-content");

  select(el)
    .append("p")
    .attr("class", "interaction-title")
    .text(
      `${accession} has binary interactions with ${nodes.length - 1} proteins`
    );

  const margin = {
      top: 100,
      right: 0,
      bottom: 10,
      left: 100
    },
    width = 18 * nodes.length;

  const height = width;

  const x = scaleBand().rangeRound([0, width]),
    intensity = scaleLinear().range([0.2, 1]);

  const svg = select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "interaction-viewer")
    .append("g")
    .attr("class", "interaction-viewer-group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(nodes.map(entry => entry.accession));
  intensity.domain([0, 10]);

  // x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
  // d3.max(nodes.map(link => link.experiments))]);

  const row = svg
    .selectAll(".interaction-row")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "interaction-row")
    .attr("transform", d => `translate(0,${x(d.accession)})`)
    .each(processRow);

  row
    .append("rect")
    .attr("x", -margin.left)
    .attr("width", margin.left)
    .attr("height", x.bandwidth())
    .attr("class", "text-highlight");

  // left axis text
  row
    .append("text")
    .attr("y", x.bandwidth() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "end")
    .text((d, i) => {
      return nodes[i].name;
    })
    .attr("class", (d, i) =>
      nodes[i].accession === accession ? "main-accession" : ""
    );

  const column = svg
    .selectAll(".column")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "column")
    .attr("transform", d => `translate(${x(d.accession)}, 0)rotate(-90)`);

  column
    .append("rect")
    .attr("x", 6)
    .attr("width", margin.top)
    .attr("height", x.bandwidth())
    .attr("class", "text-highlight");

  // top axis text
  column
    .append("text")
    .attr("x", 6)
    .attr("y", x.bandwidth() / 2)
    .attr("dy", ".32em")
    .attr("text-anchor", "start")
    .text((d, i) => nodes[i].name)
    .attr("class", (d, i) =>
      nodes[i].accession === accession ? "main-accession" : ""
    );

  var points = `${x(nodes[1].accession)} 0,${x(
    nodes[nodes.length - 1].accession
  )} 0,${x(nodes[nodes.length - 1].accession)} ${x(
    nodes[nodes.length - 1].accession
  )},${x(nodes[0].accession)} 0`;

  svg
    .append("polyline")
    .attr("points", points)
    .attr("class", "hidden-side")
    .attr("transform", d => `translate(${x(nodes[1].accession)}, 0)`);

  function processRow(row) {
    if (!row.interactions) {
      return;
    }

    var cell = select(this)
      .selectAll(".cell")
      .data(row.interactions);

    var circle = cell.enter().append("circle");

    circle
      .attr("class", "cell")
      .attr("cx", d => {
        return x(d.id) + x.bandwidth() / 2;
      })
      .attr("cy", d => x.bandwidth() / 2)
      .attr("r", x.bandwidth() / 3)
      .style("fill-opacity", d => intensity(d.experiments))
      .style("display", d => {
        //Only show left half of graph
        return x(row.accession) < x(d.id) ? "none" : "";
      })
      .on("click", mouseclick)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    cell.exit().remove();
  }

  function mouseover(p) {
    select(this).classed("active-cell", true);
    selectAll(".interaction-row").classed("active", d => d.accession === p.id);
    // selectAll(".column").classed("active", d => d.accession === p.id);

    selectAll(".interaction-viewer-group")
      .append("line")
      .attr("class", "active-row")
      .attr("style", "opacity:0")
      .attr("x1", 0)
      .attr("y1", x(p.source) + x.bandwidth() / 2)
      .attr("x2", x(p.id))
      .attr("y2", x(p.source) + x.bandwidth() / 2);

    selectAll(".interaction-viewer-group")
      .append("line")
      .attr("class", "active-row")
      .attr("style", "opacity:0")
      .attr("x1", x(p.id) + x.bandwidth() / 2)
      .attr("y1", 0)
      .attr("x2", x(p.id) + x.bandwidth() / 2)
      .attr("y2", x(p.source));
  }

  function mouseclick(p) {
    populateTooltip(selectAll(".tooltip-content"), p);
    tooltip
      .style("opacity", 0.9)
      .style("display", "inline")
      .style("left", mouse(el)[0] + 10 + "px")
      .style("top", mouse(el)[1] - 15 + "px");
  }

  function populateTooltip(element, data) {
    element.html("");

    let source = nodes.find(d => d.accession === data.source);
    let target = nodes.find(d => d.accession === data.id);

    element.append("h3").text("Interaction");
    element
      .append("p")
      .append("a")
      .attr("href", getIntactLink(data.interactor1, data.interactor2))
      .attr("target", "_blank")
      .text(`Confirmed by ${data.experiments} experiment(s)`);

    var table = element
      .append("table")
      .attr("class", "interaction-viewer-table");
    var headerRow = table.append("tr");
    headerRow.append("th");
    headerRow.append("th").text("Interactor 1");
    headerRow.append("th").text("Interactor 2");

    var nameRow = table.append("tr");
    nameRow
      .append("td")
      .text("Name")
      .attr("class", "interaction-viewer-table_row-header");
    nameRow.append("td").text(`${source.name}`);
    nameRow.append("td").text(`${target.name}`);

    var uniprotRow = table.append("tr");
    uniprotRow
      .append("td")
      .text("UniProtKB")
      .attr("class", "interaction-viewer-table_row-header");
    uniprotRow
      .append("td")
      .append("a")
      .attr("href", `//uniprot.org/uniprot/${source.accession}`)
      .text(`${source.accession}`);
    uniprotRow
      .append("td")
      .append("a")
      .attr("href", `//uniprot.org/uniprot/${target.accession}`)
      .text(`${target.accession}`);

    var diseaseRow = table.append("tr");
    diseaseRow
      .append("td")
      .text("Pathology")
      .attr("class", "interaction-viewer-table_row-header");
    diseaseRow
      .append("td")
      .html(formatDiseaseInfo(source.diseases, source.accession));
    diseaseRow
      .append("td")
      .html(formatDiseaseInfo(target.diseases, target.accession));

    var subcellRow = table.append("tr");
    subcellRow
      .append("td")
      .text("Subcellular location")
      .attr("class", "interaction-viewer-table_row-header");
    subcellRow
      .append("td")
      .html(formatSubcellularLocationInfo(source.subcellularLocations));
    subcellRow
      .append("td")
      .html(formatSubcellularLocationInfo(target.subcellularLocations));

    var intactRow = table.append("tr");
    intactRow
      .append("td")
      .text("IntAct")
      .attr("class", "interaction-viewer-table_row-header");
    intactRow
      .append("td")
      .attr("colspan", 2)
      .append("a")
      .attr("href", getIntactLink(data.interactor1, data.interactor2))
      .attr("target", "_blank")
      .text(`${data.interactor1};${data.interactor2}`);
  }

  function getIntactLink(interactor1, interactor2) {
    return `//www.ebi.ac.uk/intact/query/id:${interactor1} AND id:${interactor2}`;
  }

  function mouseout() {
    selectAll("g").classed("active", false);
    selectAll("circle").classed("active-cell", false);
    selectAll(".active-row").remove();
  }

  function closeTooltip() {
    selectAll(".interaction-tooltip")
      .style("opacity", 0)
      .style("display", "none");
  }
}
export default drawAdjacencyGraph;
