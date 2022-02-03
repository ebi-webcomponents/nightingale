/* eslint-disable no-param-reassign */
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { load } from "data-loader";
import { select } from "d3";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";

import process, { AdjacencyMap, ProcessedData } from "./apiLoader";
import drawAdjacencyGraph from "./AdjacencyGraph";
// import drawFilters, { getNameAsHTMLId } from "./filters";

import styles from "./styles";
import { APIInteractionData } from "./data";
import { FilterNode } from "./treeMenu";
// eslint-disable-next-line import/no-duplicates
import InteractionTooltip from "./interaction-tooltip";
// eslint-disable-next-line import/no-duplicates
import { FILTER_SELECT } from "./interaction-filters";

// Import additional components
// eslint-disable-next-line import/no-duplicates
import "./interaction-filters";
// eslint-disable-next-line import/no-duplicates
import "./interaction-tooltip";

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

const filterAdjacencyMap = (
  adjacencyMap: AdjacencyMap,
  filteredAccessions: string[]
): AdjacencyMap => {
  if (!filteredAccessions.length) {
    return adjacencyMap;
  }
  return adjacencyMap.map(({ accession, interactors }) => ({
    accession,
    interactors: interactors.filter(
      (interactor) =>
        filteredAccessions.includes(interactor) ||
        filteredAccessions.includes(accession)
    ),
  }));
};

@customElement("interaction-viewer")
export default class InteractionViewer extends LitElement {
  private filters: FilterNode[] = [];

  private nodes: APIInteractionData[] = null;

  @property()
  accession: string;

  @property()
  processedData?: ProcessedData;

  @property()
  filteredAccessions: string[] = [];

  private handleFilterSelection(event: CustomEvent): void {
    this.filteredAccessions = event.detail;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.addEventListener(FILTER_SELECT, this.handleFilterSelection);

    if (!this.accession) {
      return;
    }
    const response = await load(
      `https://www.ebi.ac.uk/proteins/api/proteins/interaction/${this.accession}.json`
    );
    const data = response.payload as APIInteractionData[];
    this.processedData = process(data);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(FILTER_SELECT, this.handleFilterSelection);
  }

  static styles = styles;

  getNodeByAccession(accession: string): APIInteractionData {
    return this.nodes.find((node) => node.accession === accession);
  }

  async updated(): Promise<void> {
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

    if (this.processedData) {
      dispatchLoadedEvent(this);
      drawAdjacencyGraph(
        container,
        this.accession,
        {
          ...this.processedData,
          adjacencyMap: filterAdjacencyMap(
            this.processedData.adjacencyMap,
            this.filteredAccessions
          ),
        },
        tooltip
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    let count;

    if (this.processedData) {
      const { adjacencyMap } = this.processedData;

      // Filter out itself and its isoforms
      count = adjacencyMap.filter(
        ({ accession }) => !accession.startsWith(this.accession)
      ).length;
    }

    return html` <p class="interaction-title">
        ${this.accession} has binary interactions with ${count} proteins
      </p>

      <interaction-filters
        filterConfig=${JSON.stringify(this.processedData?.filterConfig)}
      ></interaction-filters>
      <div id="container"></div>
      <interaction-tooltip id="tooltip"></interaction-tooltip>`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface HTMLElementTagNameMap {
    "interaction-viewer": InteractionViewer;
  }
}
