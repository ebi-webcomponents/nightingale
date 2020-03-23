import { select, selectAll, mouse } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { addStringItem, traverseTree } from "./treeMenu";

const formatDiseaseInfo = (data, acc) => {
  if (data) {
    let formatedString = "";
    for (const disease of data) {
      if (disease.dbReference) {
        // Some have only text
        formatedString += `<p><a href="//www.uniprot.org/uniprot/${acc}#${disease.acronym}" target="_blank">${disease.diseaseId}</a></p>`;
      }
    }
    return formatedString;
  }
  return "N/A";
};

const closeTooltip = () => {
  selectAll(".interaction-tooltip")
    .style("opacity", 0)
    .style("display", "none");
};

const formatSubcellularLocationInfo = data => {
  if (data) {
    let formatedString = '<ul class="tree-list">';
    const tree = [];
    data
      .filter(d => d.locations)
      .forEach(interactionType => {
        for (const location of interactionType.locations) {
          addStringItem(location.location.value, tree);
          // formatedString += `<p>${location.location.value}</p>`;
        }
      });
    traverseTree(
      tree,
      d =>
        (formatedString += `<li style="margin-left:${d.depth}em">${d.name}</li>`)
    );
    return `${formatedString}</ul>`;
  }
  return "N/A";
};

const drawAdjacencyGraph = (el, accession, data) => {
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
  };

  const width = 18 * nodes.length;

  const height = width;

  const x = scaleBand().rangeRound([0, width]);
  const intensity = scaleLinear().range([0.2, 1]);

  const svg = select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "interaction-viewer")
    .append("g")
    .attr("class", "interaction-viewer-group")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  x.domain(nodes.map(entry => entry.accession));
  intensity.domain([0, 10]);

  // x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
  // d3.max(nodes.map(link => link.experiments))]);

  const getIntactLink = (interactor1, interactor2) => {
    return `//www.ebi.ac.uk/intact/query/id:${interactor1} AND id:${interactor2}`;
  };

  const mouseover = p => {
    select(this).classed("active-cell", true);
    // selectAll(".interaction-row").classed("active", d => d.accession === p.id);
    // selectAll(".column").classed("active", d => d.accession === p.id);

    selectAll(".interaction-viewer-group")
      .append("line")
      .attr("class", "active-row")
      .attr("style", "opacity:0.3")
      .attr("x1", 0)
      .attr("y1", x(p.source) + x.bandwidth() / 2)
      .attr("x2", x(p.id))
      .attr("y2", x(p.source) + x.bandwidth() / 2);

    selectAll(".interaction-viewer-group")
      .append("line")
      .attr("class", "active-row")
      .attr("style", "opacity:0.3")
      .attr("x1", x(p.id) + x.bandwidth() / 2)
      .attr("y1", 0)
      .attr("x2", x(p.id) + x.bandwidth() / 2)
      .attr("y2", x(p.source));
  };

  const mouseout = () => {
    selectAll("g").classed("active", false);
    selectAll("circle").classed("active-cell", false);
    selectAll(".active-row").remove();
  };

  const populateTooltip = (element, data) => {
    element.html("");

    const source = nodes.find(d => d.accession === data.source);
    const target = nodes.find(d => d.accession === data.id);

    element.append("h3").text("Interaction");
    element
      .append("p")
      .append("a")
      .attr("href", getIntactLink(data.interactor1, data.interactor2))
      .attr("target", "_blank")
      .text(`Confirmed by ${data.experiments} experiment(s)`);

    const table = element
      .append("table")
      .attr("class", "interaction-viewer-table");
    const headerRow = table.append("tr");
    headerRow.append("th");
    headerRow.append("th").text("Interactor 1");
    headerRow.append("th").text("Interactor 2");

    const nameRow = table.append("tr");
    nameRow
      .append("td")
      .text("Name")
      .attr("class", "interaction-viewer-table_row-header");
    nameRow.append("td").text(`${source.name}`);
    nameRow.append("td").text(`${target.name}`);

    const uniprotRow = table.append("tr");
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

    const diseaseRow = table.append("tr");
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

    const subcellRow = table.append("tr");
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

    const intactRow = table.append("tr");
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
  };

  const mouseclick = p => {
    populateTooltip(selectAll(".tooltip-content"), p);
    tooltip
      .style("opacity", 0.9)
      .style("display", "inline")
      .style("left", `${mouse(el)[0] + 10}px`)
      .style("top", `${mouse(el)[1] - 15}px`);
  };

  function processRow(row) {
    if (!row.interactions) {
      return;
    }

    const cell = select(this)
      .selectAll(".cell")
      .data(row.interactions);

    const circle = cell.enter().append("circle");

    circle
      .attr("class", "cell")
      .attr("cx", d => {
        return x(d.id) + x.bandwidth() / 2;
      })
      .attr("cy", () => x.bandwidth() / 2)
      .attr("r", x.bandwidth() / 3)
      .style("fill-opacity", d => intensity(d.experiments))
      .style("display", d => {
        // Only show left half of graph
        return x(row.accession) < x(d.id) ? "none" : "";
      })
      .on("click", mouseclick)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    cell.exit().remove();
  }

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

  const points = `${x(nodes[1].accession)} 0,${x(
    nodes[nodes.length - 1].accession
  )} 0,${x(nodes[nodes.length - 1].accession)} ${x(
    nodes[nodes.length - 1].accession
  )},${x(nodes[0].accession)} 0`;

  svg
    .append("polyline")
    .attr("points", points)
    .attr("class", "hidden-side")
    .attr("transform", () => `translate(${x(nodes[1].accession)}, 0)`);
};
export default drawAdjacencyGraph;
