/* eslint-disable class-methods-use-this */
import { NightingaleElement, load } from "data-loader";
import StructureViewer from "./structure-viewer";
import translatePositions, {
  PositionMappingError,
  Mappings,
} from "./position-mapping";
import flatMap from "lodash-es/flatMap";

/*
  TODO:
  [ ] Molstar/Mol* data fetching optimizations - create query to fetch only what is needed from model server, caching https://www.ebi.ac.uk/panda/jira/browse/TRM-26073
  [ ] Molstar/Mol* bundle optimizations - only load the plugins that are absolutely needed https://www.ebi.ac.uk/panda/jira/browse/TRM-26074
  [ ] Change highlight color in Mol* https://www.ebi.ac.uk/panda/jira/browse/TRM-26075
*/

type NightingaleManager = NightingaleElement & {
  register: (element: NightingaleElement) => void;
  unregister: (element: NightingaleElement) => void;
};

type HighLight = Array<{ start: number; end: number }>;

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
};

const sendGAEvent = (eventAction: string, label?: string) => {
  const { ga } = window as Window & {
    ga?: (
      action: string,
      hitType: string,
      category: string,
      eventAction: string,
      label?: string
    ) => void;
  };
  if (ga) {
    ga("send", "event", "protvista-structure", eventAction, label);
  }
};

class ProtvistaStructure extends HTMLElement implements NightingaleElement {
  private _height: string;

  private _accession: string;

  private _structureId: string;

  private _uniProtMappingUrl =
    "https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/";

  private _alphaFoldMappingUrl = "https://alphafold.ebi.ac.uk/api/prediction/";

  private _customDownloadUrl: string;

  private manager: NightingaleManager;

  private _highlight: HighLight;

  private _structureViewer: StructureViewer;

  private _plannedRender: boolean;

  private _selectedMolecule: {
    id: string;
    mappings: Mappings;
  };

  constructor() {
    super();
    this._planHighlight = this._planHighlight.bind(this);
    this.propagateHighlight = this.propagateHighlight.bind(this);
  }

  static get is(): string {
    return "protvista-structure";
  }

  get css(): string {
    return `
    protvista-structure h4 {
      display: inline;
      margin-right: 1em;
    }
      
    .structure-viewer-container {
      position: relative;
      height: ${this._height};
    }
    `;
  }

  get accession(): string {
    return this._accession;
  }

  set accession(accession: string) {
    this.setAttribute("accession", accession);
  }

  get structureId(): string {
    return this._structureId;
  }

  set structureId(structureId: string) {
    this.setAttribute("structureid", structureId);
    this._structureId = structureId;
  }

  get height(): string {
    return this.getAttribute("height");
  }

  set height(height: string) {
    this.setAttribute("height", height);
    this._height = height;
  }

  updateUrls(): void {
    this._uniProtMappingUrl =
      this.getAttribute("uniprot-mapping-url") || this._uniProtMappingUrl;
    this._alphaFoldMappingUrl =
      this.getAttribute("alphafold-mapping-url") || this._alphaFoldMappingUrl;
    this._customDownloadUrl = this.getAttribute("custom-download-url");
  }

  connectedCallback(): void {
    // Cleanup
    this.innerHTML = "";

    const manager = this.closest<HTMLElement>("protvista-manager");
    if (manager && "register" in manager && "unregister" in manager) {
      this.manager = manager as NightingaleManager;
      this.manager.register(this);
    }
    this._structureId = this.getAttribute("structureid");
    this._accession = this.getAttribute("accession");
    this._height = this.getAttribute("height") || "480px";
    this._highlight =
      this.getAttribute("highlight") &&
      ProtvistaStructure._parseHighlight(this.getAttribute("highlight"));
    this.updateUrls();

    const style = document.createElement("style");
    style.innerHTML = this.css;
    this.appendChild(style);

    const structureViewerDiv = document.createElement("div");
    structureViewerDiv.className = "structure-viewer-container";
    structureViewerDiv.id = "structure-viewer-instance";
    this.appendChild(structureViewerDiv);
    this._structureViewer = new StructureViewer(
      structureViewerDiv,
      this.propagateHighlight,
      this.hasAttribute("use-ctrl-to-zoom")
    );
  }

  disconnectedCallback(): void {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  static get observedAttributes(): string[] {
    return ["highlight", "structureid", "accession", "height"];
  }

  static _parseHighlight(highlightString: string): HighLight {
    if (!highlightString) {
      return [];
    }
    const highlightArray = highlightString.split(",").map((region) => {
      const [_start, _end] = region.split(":");
      return {
        start: Number(_start),
        end: Number(_end),
      };
    });
    return highlightArray;
  }

  attributeChangedCallback(
    attrName: string,
    oldVal: string,
    newVal: string
  ): void {
    if (oldVal !== newVal) {
      switch (attrName) {
        case "structureid":
          if (newVal !== null) {
            this._structureId = newVal;
          }
          this.selectMolecule();
          break;

        case "accession":
          this._accession = newVal;
          this.selectMolecule();
          break;

        case "highlight":
          this._highlight = ProtvistaStructure._parseHighlight(
            this.getAttribute("highlight")
          );
          break;

        case "height":
          this._height = newVal;
          break;

        default:
          break;
      }

      this._planHighlight();
    }
  }

  _planHighlight(): void {
    // If rendering is already planned, skip the rest
    if (this._plannedRender) {
      return;
    }
    // Set a flag and _planRender at the next frame
    this._plannedRender = true;
    requestAnimationFrame(() => {
      // Removes the planned rendering flag
      this._plannedRender = false;

      if (!this._selectedMolecule) {
        return;
      }

      this.highlightChain();
    });
  }

  async loadPDBEntry(pdbId: string): Promise<unknown> {
    this._structureViewer?.clear(pdbId);
    try {
      sendGAEvent("load-PDBe", pdbId);
      const { payload } = await load(`${this._uniProtMappingUrl}${pdbId}`);
      return payload;
    } catch (e) {
      // console.log(e);
      this._structureViewer.showMessage("Error", `Couldn't load PDB entry`);
      throw e;
    }
  }

  async loadAFEntry(id: string): Promise<PredictionData[]> {
    this._structureViewer?.clear(id);
    try {
      const { payload } = await load(`${this._alphaFoldMappingUrl}${id}`);
      sendGAEvent("load-AF", id);
      return payload;
    } catch (e) {
      // console.log(e);
      this._structureViewer.showMessage("Error", `Couldn't load AF entry`);
      throw e;
    }
  }

  isAF(): boolean {
    return this._structureId.startsWith("AF-");
  }

  // https://www.ebi.ac.uk/pdbe/model-server/v1/1cbs/full?encoding=bcif
  // Use the url above for testing
  async selectMolecule(): Promise<void> {
    if (!this._structureId || !this._accession) {
      return;
    }
    this.updateUrls();
    let mappings;
    if (this.isAF()) {
      const afPredictions = await this.loadAFEntry(this._accession);
      const afInfo = afPredictions.find(
        (prediction) => prediction.entryId === this._structureId
      );
      await this._structureViewer.loadCifUrl(this._structureId, afInfo.cifUrl);
      // mappings = await this._structureViewer.loadAF(afPredictions.b);
    } else {
      const pdbEntry = await this.loadPDBEntry(this._structureId);
      mappings = Object.values(pdbEntry)[0].UniProt[this._accession]?.mappings;
      if (this._customDownloadUrl) {
        await this._structureViewer.loadCifUrl(
          this._structureId,
          `${this._customDownloadUrl}${this._structureId.toLowerCase()}.cif`
        );
      } else {
        await this._structureViewer.loadPdb(this._structureId.toLowerCase());
      }
    }
    this._selectedMolecule = {
      id: this._structureId,
      mappings,
    };
    this._planHighlight();
  }

  propagateHighlight(
    sequencePositions: { chain: string; position: number }[]
  ): void {
    // sequencePositions assumed to be in PDB coordinate space
    if (
      !sequencePositions?.length ||
      sequencePositions.some((pos) => !Number.isInteger(pos.position))
    ) {
      return;
    }

    let translated;
    try {
      translated = flatMap(sequencePositions, (pos) =>
        translatePositions(
          pos.position,
          pos.position,
          this._selectedMolecule.mappings,
          "PDB_UP"
        ).filter((t) => t.chain === pos.chain)
      ).filter(Boolean);
    } catch (error) {
      if (error instanceof PositionMappingError) {
        this._structureViewer.showMessage("Error", error.message);
        return;
      }
      throw error;
    }
    if (!translated.length) {
      this._structureViewer.showMessage(
        "Error",
        "Residue outside of sequence range"
      );
      return;
    }
    const highlight = translated.map(
      (residue) => `${residue.start}:${residue.end}`
    );
    this.setAttribute("highlight", highlight.join(","));
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
    if (!this._highlight || typeof this._highlight === "string") {
      return;
    }

    let translatedPositions;
    try {
      translatedPositions = flatMap(this._highlight, ({ start, end }) => {
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
          this._selectedMolecule.mappings,
          "UP_PDB"
        );
      }).filter(Boolean);
    } catch (error) {
      if (error instanceof PositionMappingError) {
        this._structureViewer.clearHighlight();
        this._structureViewer.showMessage("Error", error.message);
        return;
      }
      throw error;
    }
    if (!translatedPositions?.length) {
      this._structureViewer.clearHighlight();
      return;
    }

    this._structureViewer.highlight(translatedPositions);
    this._structureViewer.clearMessages();
  }
}

export default ProtvistaStructure;
