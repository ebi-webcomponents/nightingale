/* eslint-disable */
import { select, selectAll, mouse } from "d3-selection";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";
import { load, process } from "./apiLoader";
import { addStringItem, traverseTree, getPath } from "./treeMenu";
import "../styles/main.css";
import drawAdjacencyGraph from "./AdjacencyGraph";
import drawFilters, { getNameAsHTMLId } from "./filters";

const ADJACENCY_GRAPH = "ADJACENCY_GRAPH";
const FORCE_DIRECTED_GRAPH = "FORCE_DIRECTED_GRAPH";

function getFilters(subcellulartreeMenu, diseases) {
  return [
    {
      name: "subcellularLocations",
      label: "Subcellular location",
      type: "tree",
      items: subcellulartreeMenu
    },
    {
      name: "diseases",
      label: "Diseases",
      items: diseases
    }
  ];
}

const dispatchLoadedEvent = (el, error) => {
  el.dispatchEvent(
    new CustomEvent("protvista-event", {
      detail: {
        loaded: true,
        error: error
      },
      bubbles: true
    })
  );
};

class InteractionViewer extends HTMLElement {
  constructor() {
    super();
    this.mode = ADJACENCY_GRAPH;
    this.filters = [];
    this.nodes;
    this.clickFilter = this.clickFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.resetAllFilters = this.resetAllFilters.bind(this);
    this.updateFilterSelection = this.updateFilterSelection.bind(this);
    this.filterData = this.filterData.bind(this);
    this.getNodeByAccession = this.getNodeByAccession.bind(this);
  }

  connectedCallback() {
    this._accession = this.getAttribute("accession");
    this.render();
  }

  static get observedAttributes() {
    return ["accession"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === "accession" && oldVal != null && oldVal != newVal) {
      this._accession = newVal;
      this.render();
    }
  }

  set accession(accession) {
    this._accession = accession;
  }

  get accession() {
    return this._accession;
  }

  clickFilter(d, filterName) {
    selectAll(".dropdown-pane").style("visibility", "hidden");
    this.filters
      .filter(d => d.type === filterName)
      .forEach(d => (d.selected = false));
    d.selected = !d.selected;
    select(`[data-toggle=iv_${filterName}]`).text(ellipsis(d.name));
    this.updateFilterSelection();
  }

  resetFilter(filterName, filterLabel) {
    selectAll(".dropdown-pane").style("visibility", "hidden");
    this.filters
      .filter(d => d.type === filterName)
      .forEach(d => (d.selected = false));
    select(`[data-toggle=iv_${filterName}]`).text(filterLabel);
    this.updateFilterSelection();
  }

  updateFilterSelection() {
    for (let filter of this.filters) {
      let item = select(`#${getNameAsHTMLId(filter.name)}`);
      item.classed("active", filter.selected);
    }
    this.filterData();
  }

  removeFilter(d) {
    d.selected = false;
    updateFilterSelection();
  }

  resetAllFilters() {
    this.filters.filter(d => d.selected).forEach(d => (d.selected = false));
    getFilters().forEach(d => {
      select(`[data-toggle=iv_${d.name}]`).text(d.label);
    });
    this.updateFilterSelection();
  }

  getNodeByAccession(accession) {
    return this.nodes.find(node => node.accession === accession);
  }

  // Check if either the source or the target contain one of the specified
  // filters. returns true if no filters selected
  hasFilterMatch(source, target, filters) {
    if (filters.length <= 0) {
      return true;
    }
    const interactionFilters = _union(source.filterTerms, target.filterTerms);
    return (
      _intersection(
        interactionFilters,
        filters.map(item => item["name"])
      ).length === filters.length
    );
  }

  // Hide nodes and labels which don't belong to a visible filter
  filterData() {
    let activeFilters = this.filters.filter(d => d.selected);

    let visibleAccessions = [];
    selectAll(".cell").attr("opacity", d => {
      const source = this.getNodeByAccession(d.source);
      const target = this.getNodeByAccession(d.id);
      const visible = this.hasFilterMatch(source, target, activeFilters);
      if (visible) {
        visibleAccessions.push(source.accession);
        visibleAccessions.push(target.accession);
      }
      return visible ? 1 : 0.1;
    });
    selectAll(".interaction-viewer text").attr("fill-opacity", d => {
      return visibleAccessions.includes(d.accession) ? 1 : 0.1;
    });
  }

  async render() {
    if (!this._accession) {
      return;
    }
    this.style.display = "block";
    this.style.minHeight = "6em";

    // clear all previous vis
    select(this)
      .select(".interaction-title")
      .remove();
    select(this)
      .select("svg")
      .remove();
    select(this)
      .select(".interaction-tooltip")
      .remove();

    const jsonData = await load(this._accession)
      .then(async response => await response.json().then(json => json))
      .catch(e => dispatchLoadedEvent(this, e));
    if (jsonData) {
      const { data, subcellulartreeMenu, diseases } = await process(jsonData);
      this.nodes = data;
      dispatchLoadedEvent(this);
      drawFilters(
        this,
        getFilters(subcellulartreeMenu, diseases),
        this.filters,
        this.clickFilter,
        this.resetFilter,
        this.resetAllFilters
      );
      switch (this.mode) {
        case ADJACENCY_GRAPH:
          drawAdjacencyGraph(
            this,
            this._accession,
            data,
            getFilters(subcellulartreeMenu, diseases)
          );
          return;
        case FORCE_DIRECTED_GRAPH:
        //
        default:
          return;
      }
    }
  }
}

function formatDiseaseInfo(data, acc) {
  if (data) {
    let formatedString = "";
    for (var disease of data) {
      if (disease.dbReference) {
        //Some have only text
        formatedString += `<p><a href="//www.uniprot.org/uniprot/${acc}#${disease.acronym}" target="_blank">${disease.diseaseId}</a></p>`;
      }
    }
    return formatedString;
  } else {
    return "N/A";
  }
}

function formatSubcellularLocationInfo(data) {
  if (data) {
    let formatedString = '<ul class="tree-list">';
    let tree = [];
    for (var interactionType of data) {
      if (!interactionType.locations) {
        continue;
      }
      for (var location of interactionType.locations) {
        addStringItem(location.location.value, tree);
        // formatedString += `<p>${location.location.value}</p>`;
      }
    }
    traverseTree(
      tree,
      d =>
        (formatedString += `<li style="margin-left:${d.depth}em">${d.name}</li>`)
    );
    return `${formatedString}</ul>`;
  } else {
    return "N/A";
  }
}

function ellipsis(text) {
  const n = 25;
  return text.length > n ? text.substr(0, n - 1) + "..." : text;
}

function required(name) {
  throw Error(`missing option: ${name}`);
}

export default InteractionViewer;
