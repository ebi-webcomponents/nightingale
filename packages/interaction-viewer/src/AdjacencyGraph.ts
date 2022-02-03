/* eslint-disable no-param-reassign */
import { html, TemplateResult } from "lit";
import { select, mouse, scaleBand, scaleLinear } from "d3";
import InteractionTooltip from "./interaction-tooltip";
import { Disease, Interaction, SubcellularLocation } from "./data";
import { ProcessedData } from "./apiLoader";

const formatDiseaseInfo = (
  disease: Disease,
  accession: string
): TemplateResult => {
  if (disease.dbReference) {
    // Some have only text
    return html`<p>
      <a
        href="//www.uniprot.org/uniprot/${accession}#${disease.acronym}"
        target="_blank"
        >${disease.diseaseId}</a
      >
    </p>`;
  }
  return html`<p>${disease.diseaseId}</p>`;
};

const formatSubcellularLocationInfo = (
  subcell: SubcellularLocation
): TemplateResult =>
  html`${subcell.locations.map(
    (location) =>
      html`<p>
        ${location.location?.value}${location.topology
          ? `(${location.topology.value})`
          : ""}
      </p>`
  )}`;

const drawAdjacencyGraph = (
  el: HTMLElement,
  accession: string,
  processedData: ProcessedData,
  tooltip: InteractionTooltip
): void => {
  const { adjacencyMap, entryStore, interactionsMap } = processedData;
  select(el)
    .append("p")
    .attr("class", "interaction-title")
    .text(
      `${accession} has binary interactions with ${
        adjacencyMap.length - 1
      } proteins`
    );

  const margin = {
    top: 100,
    right: 0,
    bottom: 10,
    left: 100,
  };

  const width = 18 * adjacencyMap.length;

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

  x.domain(adjacencyMap.map(({ accession }) => accession));
  intensity.domain([0, 10]);

  // x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
  // d3.max(nodes.map(link => link.experiments))]);

  const getInteractionData = (
    accession1: string,
    accession2: string
  ): Interaction => {
    let data = interactionsMap.get(`${accession1}${accession2}`);
    if (!data) {
      data = interactionsMap.get(`${accession2}${accession1}`);
    }
    if (!data) {
      console.error(`Interaction not found for ${accession1}:${accession2}`);
    }
    return data;
  };

  const getIntactLink = (interactor1: string, interactor2: string): string => {
    return `//www.ebi.ac.uk/intact/query/id:${interactor1} AND id:${interactor2}`;
  };

  const mouseover = (accession1: string, accession2: string) => {
    // svg.classed("active-cell", true);

    const group = svg.insert("g", ":first-child").attr("class", "active-group");

    group
      .append("line")
      .attr("class", "active-row")
      .attr("x1", 0)
      .attr("y1", x(accession1) + x.bandwidth() / 2)
      .attr("x2", x(accession2))
      .attr("y2", x(accession1) + x.bandwidth() / 2);

    group
      .append("line")
      .attr("class", "active-row")
      .attr("x1", x(accession2) + x.bandwidth() / 2)
      .attr("y1", 0)
      .attr("x2", x(accession2) + x.bandwidth() / 2)
      .attr("y2", x(accession1));
  };

  const mouseout = () => {
    svg.selectAll(".active-group").remove();
  };

  const getTooltipContent = (accession1: string, accession2: string) => {
    const data = getInteractionData(accession1, accession2);

    const entry1 = entryStore.get(accession1);
    const entry2 = entryStore.get(accession2);

    return html`
      <a
        href=${getIntactLink(data.interactor1, data.interactor2)}
        target="_blank"
        >Confirmed by ${data.experiments} experiment(s)</a
      >

      <table>
        <thead>
          <tr>
            <th />
            <th>Interactor 1</th>
            <th>Interactor 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>${entry1.name}</td>
            <td>${entry2.name}</td>
          </tr>
          <tr>
            <td>UniProt</td>
            <td>
              <a href="//uniprot.org/uniprot/${data.accession1}"
                >${data.accession1}</a
              >
            </td>
            <td>
              <a href="//uniprot.org/uniprot/${data.accession2}"
                >${data.accession2}</a
              >
            </td>
          </tr>
          <tr>
            <td>Chain</td>
            <td>${data.chain1 || "N/A"}</td>
            <td>${data.chain2 || "N/A"}</td>
          </tr>
          <tr>
            <td>Disease association</td>
            <td>
              ${entry1.diseases?.map((disease) =>
                formatDiseaseInfo(disease, data.accession1)
              )}
            </td>
            <td>
              ${entry2.diseases?.map((disease) =>
                formatDiseaseInfo(disease, data.accession2)
              )}
            </td>
          </tr>
          <tr>
            <td>Subcellular localisation</td>
            <td>
              ${entry1.subcellularLocations?.map((subcell) =>
                formatSubcellularLocationInfo(subcell)
              )}
            </td>
            <td>
              ${entry2.subcellularLocations?.map((subcell) =>
                formatSubcellularLocationInfo(subcell)
              )}
            </td>
          </tr>
          <tr>
            <td>Intact</td>
            <td colspan="2">
              <a
                href=${getIntactLink(data.interactor1, data.interactor2)}
                target="_blank"
                >${data.interactor1};${data.interactor2}</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    `;
  };

  const mouseclick = (accession1: string, accession2: string) => {
    tooltip.x = +mouse(el)[0];
    tooltip.y = +mouse(el)[1];
    tooltip.content = getTooltipContent(accession1, accession2);
    tooltip.visible = true;
  };

  function processRow(row: { accession: string; interactors: string[] }) {
    const cell = select(this).selectAll(".cell").data(row.interactors);

    const circle = cell.enter().append("circle");

    circle
      .attr("class", "cell")
      .attr("cx", (d) => {
        return x(d) + x.bandwidth() / 2;
      })
      .attr("cy", () => x.bandwidth() / 2)
      .attr("r", x.bandwidth() / 3)
      .style("fill-opacity", (d) => {
        const data = getInteractionData(row.accession, d);
        return intensity(data?.experiments) || 1;
      })
      // .style("display", (d) => {
      //   // Only show left half of graph
      //   return x(row.accession) < x(d.id) ? "none" : "";
      // })
      .on("click", (e) => mouseclick(row.accession, e))
      .on("mouseover", (e) => mouseover(row.accession, e))
      .on("mouseout", mouseout);

    cell.exit().remove();
  }

  const row = svg
    .selectAll(".interaction-row")
    .data(adjacencyMap)
    .enter()
    .append("g")
    .attr("class", "interaction-row")
    .attr("transform", (d) => `translate(0,${x(d.accession)})`)
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
    .text((d) => {
      return entryStore.get(d.accession).name;
    })
    .attr("class", (d) => (d.accession === accession ? "main-accession" : ""));

  const column = svg
    .selectAll(".column")
    .data(adjacencyMap)
    .enter()
    .append("g")
    .attr("class", "column")
    .attr("transform", (d) => `translate(${x(d.accession)}, 0)rotate(-90)`);

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
    .text((d) => entryStore.get(d.accession).name)
    .attr("class", (d) => (d.accession === accession ? "main-accession" : ""));

  // const points = `${x(nodes[1].accession)} 0,${x(
  //   nodes[nodes.length - 1].accession
  // )} 0,${x(nodes[nodes.length - 1].accession)} ${x(
  //   nodes[nodes.length - 1].accession
  // )},${x(nodes[0].accession)} 0`;

  // svg
  //   .append("polyline")
  //   .attr("points", points)
  //   .attr("class", "hidden-side")
  //   .attr("transform", () => `translate(${x(nodes[1].accession)}, 0)`);
};
export default drawAdjacencyGraph;
