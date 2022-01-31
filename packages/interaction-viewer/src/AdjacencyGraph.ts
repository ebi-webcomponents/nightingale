/* eslint-disable no-param-reassign */
import { html } from "lit";
import { select, selectAll, mouse, scaleBand, scaleLinear } from "d3";
import InteractionTooltip from "./interaction-tooltip";
import { addStringItem, traverseTree } from "./treeMenu";
import { APIInteractionData, Interaction } from "./data";
import { EntryData, trimIsoformSuffix } from "./apiLoader";

// const formatDiseaseInfo = (data, acc: string): string => {
//   if (data) {
//     let formatedString = "";
//     for (const disease of data) {
//       if (disease.dbReference) {
//         // Some have only text
//         formatedString += `<p><a href="//www.uniprot.org/uniprot/${acc}#${disease.acronym}" target="_blank">${disease.diseaseId}</a></p>`;
//       }
//     }
//     return formatedString;
//   }
//   return "N/A";
// };

// const closeTooltip = () => {
//   selectAll(".interaction-tooltip")
//     .style("opacity", 0)
//     .style("display", "none");
// };

// const formatSubcellularLocationInfo = (data) => {
//   if (data) {
//     let formatedString = '<ul class="tree-list">';
//     const tree = [];
//     data
//       .filter((d) => d.locations)
//       .forEach((interactionType) => {
//         for (const location of interactionType.locations) {
//           addStringItem(location.location.value, tree);
//           // formatedString += `<p>${location.location.value}</p>`;
//         }
//       });
//     traverseTree(
//       tree,
//       (d) =>
//         (formatedString += `<li style="margin-left:${d.depth}em">${d.name}</li>`)
//     );
//     return `${formatedString}</ul>`;
//   }
//   return "N/A";
// };

const drawAdjacencyGraph = (
  el: HTMLElement,
  accession: string,
  adjacencyMap: { accession: string; interactors: string[] }[],
  interactionsMap: Map<string, Interaction>,
  entryStore: Map<string, EntryData>,
  tooltip: InteractionTooltip
): void => {
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

  // const mouseover = (p) => {
  //   select(this).classed("active-cell", true);
  //   // selectAll(".interaction-row").classed("active", d => d.accession === p.id);
  //   // selectAll(".column").classed("active", d => d.accession === p.id);

  //   selectAll(".interaction-viewer-group")
  //     .append("line")
  //     .attr("class", "active-row")
  //     .attr("style", "opacity:0.3")
  //     .attr("x1", 0)
  //     .attr("y1", x(p.source) + x.bandwidth() / 2)
  //     .attr("x2", x(p.id))
  //     .attr("y2", x(p.source) + x.bandwidth() / 2);

  //   selectAll(".interaction-viewer-group")
  //     .append("line")
  //     .attr("class", "active-row")
  //     .attr("style", "opacity:0.3")
  //     .attr("x1", x(p.id) + x.bandwidth() / 2)
  //     .attr("y1", 0)
  //     .attr("x2", x(p.id) + x.bandwidth() / 2)
  //     .attr("y2", x(p.source));
  // };

  // const mouseout = () => {
  //   selectAll("g").classed("active", false);
  //   selectAll("circle").classed("active-cell", false);
  //   selectAll(".active-row").remove();
  // };

  const getTooltipContent = (accession1: string, accession2: string) => {
    const data = getInteractionData(accession1, accession2);

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
            <td>${entryStore.get(accession1).name}</td>
            <td>${entryStore.get(accession2).name}</td>
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
            <td>TODO</td>
            <td>TODO</td>
          </tr>
          <tr>
            <td>Subcellular localisation</td>
            <td>TODO</td>
            <td>TODO</td>
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
        const data = getInteractionData(
          trimIsoformSuffix(row.accession),
          trimIsoformSuffix(d)
        );
        return intensity(data?.experiments) || 1;
      })
      // .style("display", (d) => {
      //   // Only show left half of graph
      //   return x(row.accession) < x(d.id) ? "none" : "";
      // })
      .on("click", (e) => mouseclick(row.accession, e));
    // .on("mouseover", mouseover)
    // .on("mouseout", mouseout)

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
    });
  // .attr("class", (d, i) =>
  //   nodes[i].accession === accession ? "main-accession" : ""
  // );

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
    .text((d) => entryStore.get(d.accession).name);
  // .text((d, i) => nodes[i].name)
  // .attr("class", (d, i) =>
  //   nodes[i].accession === accession ? "main-accession" : ""
  // );

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
