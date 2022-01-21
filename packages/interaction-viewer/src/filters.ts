/* eslint-disable no-param-reassign */
import { select } from "d3-selection";
import { FilterDefinition } from "./interaction-viewer";
import { FilterNode, traverseTree } from "./treeMenu";

function toggleFilterVisibility() {
  const id = `#${select(this).attr("data-toggle")}`;
  const visibility = select(id).style("visibility");
  select(".dropdown-pane").style("visibility", "hidden");
  select(id).style(
    "visibility",
    visibility === "hidden" ? "visible" : "hidden"
  );
}

export const getNameAsHTMLId = (name: string): string =>
  name.toLowerCase().replace(/\s|,|^\d/g, "_");

// Add a filter to the interface
function drawFilters(
  el: HTMLElement,
  filtersToAdd: FilterDefinition[],
  allFilters: FilterNode[],
  clickFilter: (d: FilterNode, filterName: string) => void,
  resetFilter: (filterName: string, filterLabel: string) => void,
  resetAllFilters: () => void
): void {
  select(el).selectAll(".interaction-filter-container").remove();
  const container = select(el)
    .append("div")
    .attr("class", "interaction-filter-container");

  // container.append("div").text('Show only interactions where one or both
  // interactors have:');
  for (const filter of filtersToAdd) {
    if (filter.items.length > 0) {
      const filterContainer = container
        .append("div")
        .attr("class", "interaction-filter");
      filterContainer
        .append("a")
        .text(filter.label)
        .attr("class", "button dropdown")
        .attr("data-toggle", `iv_${filter.name}`)
        .on("click", toggleFilterVisibility);

      const ul = filterContainer
        .append("ul")
        .attr("id", `iv_${filter.name}`)
        .attr("class", "dropdown-pane");

      ul.append("li")
        .text("None")
        .on("click", () => resetFilter(filter.name, filter.label));
      if (filter.type === "tree") {
        traverseTree(filter.items, (d) => {
          d.type = filter.name;
          allFilters.push(d);
          ul.datum(d)
            .append("li")
            .style("padding-left", `${d.depth}em`)
            .attr("id", (d) => getNameAsHTMLId(d.name))
            .text((d) => d.name)
            .on("click", (d) => clickFilter(d, filter.name));
        });
      } else {
        for (const d of filter.items) {
          d.type = filter.name;
          allFilters.push(d);
        }

        ul.selectAll("li")
          .data(filter.items)
          .enter()
          .append("li")
          .attr("id", (d) => getNameAsHTMLId(d.name))
          .text((d) => d.name.toLowerCase())
          .on("click", (d) => {
            clickFilter(d, filter.name);
          });
      }
    }
  }
  container
    .append("button")
    .attr("class", "iv_reset")
    .text("Reset filters")
    .on("click", () => {
      resetAllFilters();
      return false;
    });
  // return allFilters;
}

export default drawFilters;
