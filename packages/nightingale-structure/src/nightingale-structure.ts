/* eslint-disable class-methods-use-this */
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import NightingaleElement, {
  withHighlight,
  withManager,
  customElementOnce,
} from "@nightingale-elements/nightingale-new-core";

import { getStructureViewer, StructureViewer } from "./structure-viewer";
import translatePositions, {
  PositionMappingError,
  Mapping,
  TranslatedPosition,
} from "./position-mapping";

/*
  TODO:
  [ ] Molstar/Mol* data fetching optimizations - create query to fetch only what is needed from model server, caching https://www.ebi.ac.uk/panda/jira/browse/TRM-26073
  [ ] Molstar/Mol* bundle optimizations - only load the plugins that are absolutely needed https://www.ebi.ac.uk/panda/jira/browse/TRM-26074
  [ ] Change highlight color in Mol* https://www.ebi.ac.uk/panda/jira/browse/TRM-26075
*/

export type StructureData = {
  dbReferences: {
    type: "PDB" | string;
    id: string;
    properties: {
      method: string;
      chains: string;
      resolution: string;
    };
  }[];
};

export type PDBData = Record<
  string,
  {
    UniProt: Record<
      string,
      {
        identifier: string;
        name: string;
        mappings: Mapping[];
      }
    >;
  }
>;

export type PredictionData = {
  entryId: string;
  gene?: string;
  uniprotAccession?: string;
  uniprotId?: string;
  uniprotDescription?: string;
  taxId?: number;
  organismScientificName?: string;
  uniprotStart?: number;
  uniprotEnd?: number;
  uniprotSequence?: string;
  modelCreatedDate?: string;
  latestVersion?: number;
  allVersions?: number[];
  bcifUrl?: string;
  cifUrl?: string;
  pdbUrl?: string;
  distogramUrl?: string;
  amAnnotationsUrl?: string;
};

const uniProtMappingUrl = "https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/";

const alphaFoldMappingUrl = "https://alphafold.ebi.ac.uk/api/prediction/";

@customElementOnce("nightingale-structure")
class NightingaleStructure extends withManager(
  withHighlight(NightingaleElement)
) {
  @property({ type: String })
  "protein-accession"?: string;

  @property({ type: String })
  "structure-id"?: string;

  @property({ type: String })
  "custom-download-url"?: string;

  @property({ type: String })
  "model-url"?: string;

  @property({ type: String })
  "color-theme"?: string;

  @state()
  selectedMolecule?: {
    id: string;
    mappings?: Mapping[];
  };

  @state()
  message?: { title: string; content: string } | null = {
    title: "title",
    content: "message",
  };

  #structureViewer?: StructureViewer;

  constructor() {
    super();
    this.updateHighlight = this.updateHighlight.bind(this);
  }

  protected override render() {
    return html`<style>
        /* nightingale-structure h4 {
          display: inline;
          margin-right: 1em;
        } */

        /* @property --custom-structure-height {
          syntax: "<length-percentage>";
          inherits: false;
          initial-value: 480px;
        } */

        nightingale-structure {
          width: 100%;
        }

        .structure-viewer-container {
          position: relative;
          height: var(--custom-structure-height, 480px);
        }

        .structure-viewer-messages {
          opacity: 0.75;
          position: absolute;
          right: 0;
          bottom: 0;
          border: 1px solid gray;
          padding: 1ch;
        }

        .structure-viewer-messages > *:first-child {
          font-weight: bold;
        }

        .structure-viewer-message-content {
          white-space: pre-wrap;
          line-height: normal;
        }

        .structure-viewer-messages > button {
          font-size: 75%;
          font-weight: bold;
          position: absolute;
          top: -2px;
          right: 0px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0px 3px;
        }
      </style>
      <div id="molstar-parent" class="structure-viewer-container">
        <canvas
          id="molstar-canvas"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        ></canvas>
        ${this.message
          ? html`<div class="structure-viewer-messages">
              <span>${this.message?.title}</span>:
              <span
                class="structure-viewer-message-content"
                .innerHTML=${this.message?.content}
              ></span>
              <button
                type="button"
                title="close message"
                @click="${this.clearMessage}"
              >
                x
              </button>
            </div> `
          : nothing}
      </div>`;
  }

  protected override firstUpdated() {
    const structureViewerDiv =
      this.renderRoot.querySelector<HTMLDivElement>("#molstar-parent");
    if (structureViewerDiv) {
      getStructureViewer(
        structureViewerDiv,
        this.updateHighlight,
        this["color-theme"]
      ).then((structureViewer) => {
        this.#structureViewer = structureViewer;
        // Remove initial "#" and possible trailing opacity value
        const color = this["highlight-color"].substring(1, 7);
        this.#structureViewer.changeHighlightColor(parseInt(color, 16));
        this.selectMolecule();
      });
    }
  }

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has("structure-id") ||
      changedProperties.has("model-url")
    ) {
      this.selectMolecule();
    }
    if (
      changedProperties.has("highlight") ||
      changedProperties.has("selectedMolecule")
    ) {
      this.highlightChain();
    }
    if (changedProperties.has("highlight-color")) {
      // Remove initial "#" and possible trailing opacity value
      const color = this["highlight-color"].substring(1, 7);
      this.#structureViewer?.changeHighlightColor(parseInt(color, 16));
      this.#structureViewer?.plugin.handleResize();
    }
    if (changedProperties.has("color-theme")) {
      this.#structureViewer?.applyColorTheme(this["color-theme"]);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up
    this.#structureViewer?.plugin.dispose();
  }

  async loadPDBEntry(pdbId: string): Promise<PDBData> {
    this.#structureViewer?.plugin.clear();
    this.showMessage("Loading", pdbId);
    try {
      return await fetch(`${uniProtMappingUrl}${pdbId}`).then((r) => r.json());
    } catch (e) {
      this.showMessage("Error", `Couldn't load PDB entry "${pdbId}"`);
      throw e;
    }
  }

  async loadAFEntry(id: string): Promise<PredictionData[]> {
    this.#structureViewer?.plugin.clear();
    this.showMessage("Loading", id);
    try {
      return await fetch(`${alphaFoldMappingUrl}${id}`).then((r) => r.json());
    } catch (e) {
      this.showMessage("Error", `Couldn't load AF entry "${id}"`);
      throw e;
    }
  }

  isAF(): boolean | undefined {
    return this["structure-id"]?.startsWith("AF-");
  }

  // Use the url above for testing
  async selectMolecule(): Promise<void> {
    if (this["structure-id"] && this["model-url"]) {
      console.error(
        "Structure ID and Model URL both are present. Provide only one that you would want to take precedence"
      );
      return;
    }
    // if (
    //   !this["structure-id"] ||
    //   !this["protein-accession"]
    // ) {
    //   return;
    // }
    let mappings;
    if (this["structure-id"] && this["protein-accession"]) {
      if (this.isAF()) {
        const afPredictions = await this.loadAFEntry(this["protein-accession"]);
        const afInfo = afPredictions.find(
          (prediction) => prediction.entryId === this["structure-id"]
        );
        // Note: maybe use bcif instead of cif, but I have issues loading it atm
        if (afInfo?.cifUrl) {
          await this.#structureViewer?.loadCifUrl(afInfo.cifUrl, false);
          this.clearMessage();
        }
        // mappings = await this.#structureViewer.loadAF(afPredictions.b);
      } else {
        const pdbEntry = await this.loadPDBEntry(this["structure-id"]);
        if (pdbEntry) {
          mappings =
            Object.values(pdbEntry)[0].UniProt[this["protein-accession"]]
              ?.mappings;
          if (this["custom-download-url"]) {
            await this.#structureViewer?.loadCifUrl(
              `${this["custom-download-url"]}${this[
                "structure-id"
              ].toLowerCase()}.cif`
            );
            this.clearMessage();
          } else {
            await this.#structureViewer?.loadPdb(
              this["structure-id"].toLowerCase()
            );
            this.clearMessage();
          }
        }
      }

      this.selectedMolecule = {
        id: this["structure-id"],
        mappings,
      };
    }

    if (this["model-url"]) {
      this.#structureViewer?.plugin.clear();
      await this.#structureViewer?.loadCifUrl(this["model-url"]);
      this.clearMessage();
    }
  }

  private showMessage(title: string, content: string, timeoutMs?: number) {
    const message = { title, content };
    this.message = message;
    if (timeoutMs) {
      setTimeout(() => {
        if (this.message === message) {
          this.message = null;
        }
      }, timeoutMs);
    }
  }

  private clearMessage() {
    this.message = null;
  }

  updateHighlight(
    sequencePositions: { chain: string; position: number }[]
  ): void {
    // sequencePositions assumed to be in PDB coordinate space
    if (
      !sequencePositions?.length ||
      sequencePositions.some((pos) => !Number.isInteger(pos.position))
    ) {
      return;
    }

    let translated: TranslatedPosition[];
    if (this.isAF()) {
      translated = sequencePositions.map((pos) => ({
        start: pos.position,
        end: pos.position,
        entity: 1,
        chain: pos.chain,
      }));
    } else {
      try {
        translated = sequencePositions
          .flatMap((pos) =>
            translatePositions(
              pos.position,
              pos.position,
              "PDB_UP",
              this.selectedMolecule?.mappings
            ).filter((t) => t.chain === pos.chain)
          )
          .filter(Boolean);
      } catch (error) {
        if (error instanceof PositionMappingError) {
          this.showMessage("Error", error.message);
          return;
        }
        throw error;
      }
    }
    if (!translated.length) {
      this.showMessage("Error", "Residue outside of sequence range");
      return;
    }
    const highlight = translated
      .map((residue) => `${residue.start}:${residue.end}`)
      .join(",");
    this.highlight = highlight;

    const tooltip = translated
      .map((residue) => {
        const proteinPosition =
          residue.start === residue.end
            ? residue.start
            : `${residue.start}:${residue.end}`;
        return `<span data-article-id="structure_section#description-of-structure-table-contents">Chain</span> ${residue.chain}<br /><b>${this["protein-accession"]}</b>: ${proteinPosition}`;
      })
      .join("");

    this.showMessage(`${this["structure-id"]}`, tooltip);
    const event = new CustomEvent("change", {
      detail: {
        highlight,
      },
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
  }

  highlightChain(): void {
    if (!this.highlight) {
      this.#structureViewer?.clearHighlight();
      return;
    }
    let translatedPositions;
    try {
      translatedPositions = this.highlightedRegion.segments
        .flatMap(({ start, end }) => {
          if (this.isAF()) {
            return {
              start,
              end,
              chain: "A",
            };
          }
          return translatePositions(
            start,
            end,
            "UP_PDB",
            this.selectedMolecule?.mappings
          );
        })
        .filter(Boolean);
    } catch (error) {
      if (error instanceof PositionMappingError) {
        this.#structureViewer?.clearHighlight();
        this.showMessage("Error", error.message);
        return;
      }
      throw error;
    }
    if (!translatedPositions?.length) {
      this.#structureViewer?.clearHighlight();
      return;
    }
    this.#structureViewer?.highlight(translatedPositions);
  }
}

export default NightingaleStructure;
