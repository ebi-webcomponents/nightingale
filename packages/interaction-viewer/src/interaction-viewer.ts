/* eslint-disable no-param-reassign */
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { load } from "data-loader";
import { select } from "d3-selection";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";
import process from "./apiLoader";
import drawAdjacencyGraph from "./AdjacencyGraph";
// import drawFilters, { getNameAsHTMLId } from "./filters";

import styles from "./styles";
import { APIInteractionData } from "./data";
import { FilterNode } from "./treeMenu";
import InteractionTooltip from "./interaction-tooltip";

const ADJACENCY_GRAPH = "ADJACENCY_GRAPH";
const FORCE_DIRECTED_GRAPH = "FORCE_DIRECTED_GRAPH";

function ellipsis(text: string, n = 25) {
  return text.length > n ? `${text.slice(0, n - 1)}...` : text;
}

export type FilterDefinition = {
  name: string;
  label: string;
  items: FilterNode[];
  type?: "tree";
};

function getFilters(
  subcellulartreeMenu?: FilterNode[],
  diseases?: FilterNode[]
): FilterDefinition[] {
  return [
    {
      name: "subcellularLocations",
      label: "Subcellular location",
      type: "tree",
      items: subcellulartreeMenu,
    },
    {
      name: "diseases",
      label: "Diseases",
      items: diseases,
    },
  ];
}

const dispatchLoadedEvent = (el: HTMLElement, error?: string) => {
  el.dispatchEvent(
    new CustomEvent("protvista-event", {
      detail: {
        loaded: true,
        error,
      },
      bubbles: true,
    })
  );
};

// Check if either the source or the target contain one of the specified
// filters. returns true if no filters selected
const hasFilterMatch = (
  source: APIInteractionData,
  target: APIInteractionData,
  filters: FilterDefinition[]
) => {
  if (filters.length <= 0) {
    return true;
  }
  const interactionFilters = _union(source.filterTerms, target.filterTerms);
  return (
    _intersection(
      interactionFilters,
      filters.map((item) => item.name)
    ).length === filters.length
  );
};

@customElement("interaction-viewer")
class InteractionViewer extends LitElement {
  private mode = ADJACENCY_GRAPH;

  private filters: FilterNode[] = [];

  private nodes: APIInteractionData[] = null;

  @property()
  accession: string;

  constructor() {
    super();
    // this.clickFilter = this.clickFilter.bind(this);
    // this.resetFilter = this.resetFilter.bind(this);
    // this.resetAllFilters = this.resetAllFilters.bind(this);
    // this.updateFilterSelection = this.updateFilterSelection.bind(this);
    // this.filterData = this.filterData.bind(this);
    this.getNodeByAccession = this.getNodeByAccession.bind(this);
  }

  static styles = styles;

  // clickFilter(d: FilterNode, filterName: string): void {
  //   selectAll(".dropdown-pane").style("visibility", "hidden");
  //   this.filters
  //     .filter((d) => d.type === filterName) // TODO check, this should be d.name???
  //     .forEach((d) => (d.selected = false));
  //   d.selected = !d.selected;
  //   select(`[data-toggle=iv_${filterName}]`).text(ellipsis(d.name));
  //   this.updateFilterSelection();
  // }

  // resetFilter(filterName: string, filterLabel: string): void {
  //   selectAll(".dropdown-pane").style("visibility", "hidden");
  //   this.filters
  //     .filter((d) => d.type === filterName) // TODO check, this should be d.name???
  //     .forEach((d) => (d.selected = false));
  //   select(`[data-toggle=iv_${filterName}]`).text(filterLabel);
  //   this.updateFilterSelection();
  // }

  // updateFilterSelection(): void {
  //   for (const filter of this.filters) {
  //     const item = select(`#${getNameAsHTMLId(filter.name)}`);
  //     item.classed("active", filter.selected);
  //   }
  //   this.filterData();
  // }

  // resetAllFilters(): void {
  //   this.filters.filter((d) => d.selected).forEach((d) => (d.selected = false));
  //   getFilters().forEach((d) => {
  //     select(`[data-toggle=iv_${d.name}]`).text(d.label);
  //   });
  //   this.updateFilterSelection();
  // }

  getNodeByAccession(accession: string): APIInteractionData {
    return this.nodes.find((node) => node.accession === accession);
  }

  // Hide nodes and labels which don't belong to a visible filter
  // filterData(): void {
  //   const activeFilters = this.filters.filter((d) => d.selected);

  //   const visibleAccessions: string[] = [];
  //   selectAll(".cell").attr("opacity", (d: Interaction) => {
  //     const source = this.getNodeByAccession(d.accession1);
  //     const target = this.getNodeByAccession(d.accession2);
  //     const visible = hasFilterMatch(source, target, activeFilters);
  //     if (visible) {
  //       visibleAccessions.push(source.accession);
  //       visibleAccessions.push(target.accession);
  //     }
  //     return visible ? 1 : 0.1;
  //   });

  //   // TODO fix this, which accession should this apply to?
  //   // selectAll(".interaction-viewer text").attr("fill-opacity", (d: Interaction) => {
  //   //   return visibleAccessions.includes(d.accession) ? 1 : 0.1;
  //   // });
  // }

  async updated(): Promise<void> {
    if (!this.accession) {
      return;
    }

    const container = this.shadowRoot.getElementById("container");
    const tooltip = this.shadowRoot.getElementById(
      "tooltip"
    ) as InteractionTooltip;

    container.style.display = "block";
    container.style.minHeight = "6em";

    // clear all previous vis
    select(container).select(".interaction-title").remove();
    select(container).select("svg").remove();
    select(container).select(".interaction-tooltip").remove();

    const response = await load(
      `https://www.ebi.ac.uk/proteins/api/proteins/interaction/${this.accession}.json`
    );
    const data = response.payload as APIInteractionData[];
    if (data) {
      const {
        adjacencyMap,
        interactionsMap,
        // subcellulartreeMenu,
        // diseases,
      } = process(data);
      dispatchLoadedEvent(this);
      // drawFilters(
      //   this,
      //   getFilters(subcellulartreeMenu, diseases),
      //   this.filters,
      //   this.clickFilter,
      //   this.resetFilter,
      //   this.resetAllFilters
      // );
      switch (this.mode) {
        case ADJACENCY_GRAPH:
          drawAdjacencyGraph(
            container,
            this.accession,
            adjacencyMap,
            interactionsMap,
            tooltip
            // getFilters(subcellulartreeMenu, diseases)
          );
          break;
        case FORCE_DIRECTED_GRAPH:
          break;
        //
        default:
          break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return html`<div id="container"></div>
      <interaction-tooltip id="tooltip"></interaction-tooltip>`;
  }
}

export default InteractionViewer;
