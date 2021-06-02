/* eslint-disable class-methods-use-this */
import "whatwg-fetch";
import { NightingaleElement } from "data-loader";

import StructureViewer from "./structure-viewer";

type Direction = "UP_PDB" | "PDB_UP";

/*
  Immediate TODO:
  [x] Highlight on amino acid click
  [x] Highlight sequence from attributes
  [x] Remove LiteMol
  [x] Remove unused plugins in molstar.ts
  [x] Remove title menu bar
  [x] Upgrade Mol* to v2
  [x] Rename molstar.ts to structure-viewer.ts
  [x] Translate position in propagateHighlight
  [x] Build doesn’t work (webpack issue with node fs maybe?) this will be disappear when https://github.com/molstar/molstar/commit/45ef00f1d188cc03907be19d20aed5e6aa9d0ee0 is released on npm
  [x] Clear highlights on amino acid click
  [x] Convert protvista-structure to TS
  [x] Ensure build passes

  Future TODO:
  [ ] Molstar/Mol* data fetching optimizations - create query to fetch only what is needed from model server, caching https://www.ebi.ac.uk/panda/jira/browse/TRM-26073
  [ ] Molstar/Mol* bundle optimizations - only load the plugins that are absolutely needed https://www.ebi.ac.uk/panda/jira/browse/TRM-26074
  [ ] Change highlight color in Mol* https://www.ebi.ac.uk/panda/jira/browse/TRM-26075
*/

type NightingaleManager = NightingaleElement & {
  register: (element: NightingaleElement) => void;
  unregister: (element: NightingaleElement) => void;
};

type HighLight = Array<{ start: number; end: number }>;

type Mappings = Array<{
  entity_id: string; // eslint-disable-line camelcase
  chain_id: string; // eslint-disable-line camelcase
  unp_end: number; // eslint-disable-line camelcase
  unp_start: number; // eslint-disable-line camelcase
  start: {
    residue_number: number; // eslint-disable-line camelcase
  };
  end: {
    residue_number: number; // eslint-disable-line camelcase
  };
}>;

class ProtvistaStructure extends HTMLElement implements NightingaleElement {
  private _mappings: Mappings;

  private _height: string;

  private _accession: string;

  private _pdbID: string;

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
    this._mappings = [];

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

  get pdbId(): string {
    return this._pdbID;
  }

  set pdbId(pdbId: string) {
    this.setAttribute("pdbid", pdbId);
    this._pdbID = pdbId;
  }

  get height(): string {
    return this.getAttribute("height");
  }

  connectedCallback(): void {
    const manager = this.closest<HTMLElement>("protvista-manager");
    if (manager && "register" in manager && "unregister" in manager) {
      this.manager = manager as NightingaleManager;
      this.manager.register(this);
    }

    this._pdbID = this.getAttribute("pdb-id");
    this._accession = this.getAttribute("accession");
    this._height = this.getAttribute("height") || "480px";
    this._highlight =
      this.getAttribute("highlight") &&
      ProtvistaStructure._parseHighlight(this.getAttribute("highlight"));

    const style = document.createElement("style");
    style.innerHTML = this.css;
    this.appendChild(style);

    const structureViewerDiv = document.createElement("div");
    structureViewerDiv.className = "structure-viewer-container";
    structureViewerDiv.id = "structure-viewer-instance";
    this.appendChild(structureViewerDiv);
    this._structureViewer = new StructureViewer(
      structureViewerDiv,
      this.propagateHighlight
    );
  }

  disconnectedCallback(): void {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  static get observedAttributes(): string[] {
    return ["highlight", "pdb-id", "height"];
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
      const value = parseFloat(newVal);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 🤷🏼‍♂️
      this[`_${attrName}`] = typeof value === "number" ? newVal : value;

      switch (attrName) {
        case "pdb-id":
          if (newVal !== null) {
            this._pdbID = newVal;
            this.selectMolecule(this._pdbID);
          }
          break;

        case "accession":
          this._accession = newVal;
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

  _planHighlight() {
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
    try {
      const data = await fetch(
        `https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbId}`
      );
      return await data.json();
    } catch (e) {
      this._structureViewer.showMessage("Error", `Couldn't load PDB entry`);
      throw new Error(e);
    }
  }

  async selectMolecule(id: string): Promise<void> {
    const pdbEntry = await this.loadPDBEntry(id);
    const mappings =
      Object.values(pdbEntry)[0].UniProt[this._accession]?.mappings;

    await this._structureViewer.loadPdb(id.toLowerCase());
    this._selectedMolecule = {
      id,
      mappings,
    };
    this._planHighlight();
  }

  processMapping(mappingData: unknown) {
    if (!Object.values(mappingData)[0].UniProt[this._accession]) {
      return null;
    }
    return Object.values(mappingData)[0].UniProt[this._accession].mappings;
  }

  /**
   * Translate between UniProt and PDBe positions using SIFTs mappings
   * @function translatePositions
   * @private
   * @param  {Number}     start            The start index for the sequence (1-based)
   * @param  {Number}     end              The end index for the sequence (1-based)
   * @param  {String}     mappingDirection Indicates direction of maping: UniProt to PDB or PDB to UniProt
   * @return {Translated}                  Object with: mapped entity ID; mapped chain ID; translated start & end positions
   */
  translatePositions(
    start: number,
    end: number,
    mappingDirection: Direction = "UP_PDB"
  ): {
    start: number;
    end: number;
    entity: string;
    chain: string;
  } | null {
    // return if they have been set to 'undefined'
    if (
      typeof this._highlight === "string" ||
      Number.isNaN(start) ||
      Number.isNaN(end)
    ) {
      return null;
    }
    /* eslint-disable no-restricted-syntax */
    for (const mapping of this._selectedMolecule.mappings) {
      if (
        mapping.unp_end - mapping.unp_start ===
        mapping.end.residue_number - mapping.start.residue_number
      ) {
        if (
          (mappingDirection === "UP_PDB" &&
            start >= mapping.unp_start &&
            end <= mapping.unp_end) ||
          (mappingDirection === "PDB_UP" &&
            start >= mapping.start.residue_number &&
            end <= mapping.end.residue_number)
        ) {
          const offset = mapping.unp_start - mapping.start.residue_number;
          return {
            entity: mapping.entity_id,
            chain: mapping.chain_id,
            start:
              mappingDirection === "UP_PDB" ? start - offset : start + offset,
            end: mappingDirection === "UP_PDB" ? end - offset : end + offset,
          };
        }
      } else {
        this._structureViewer.showMessage(
          "Error",
          "Mismatch between protein sequence and structure residues"
        );
      }
    }
    return null;
  }

  propagateHighlight(sequencePositions: number[]): void {
    if (
      !sequencePositions?.length ||
      sequencePositions.some((pos) => !Number.isInteger(pos))
    ) {
      return;
    }
    const highlight = sequencePositions
      .map((pos) => this.translatePositions(pos, pos, "PDB_UP"))
      .filter(Boolean)
      .map((residue) => `${residue.start}:${residue.end}`);
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
    if (!this._highlight) {
      return;
    }

    const translatedPositions = this._highlight
      .map(({ start, end }) => this.translatePositions(start, end))
      .filter(Boolean);

    if (!translatedPositions?.length) {
      return;
    }

    this._structureViewer.highlight(translatedPositions);
    this._structureViewer.clearMessages();
  }
}

export default ProtvistaStructure;
