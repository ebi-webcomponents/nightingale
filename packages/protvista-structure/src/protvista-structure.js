/* eslint-disable class-methods-use-this */
import "whatwg-fetch";
import MolStar from "./molstar";

const UP_PDB = "UP_PDB";
const PDB_UP = "PDB_UP";

/*
  TODO:
  [x] Remove LiteMol
  [x] Remove unused plugins in molstar.ts
  [x] Remove title menu bar
  [ ] Should Mol* be a peerDependency?
  [ ] Build doesn’t work (webpack issue with node fs maybe?)
  [ ] Convert protvista-structure to TS
  [ ] Translate position in propagateHighlight
  [ ] Test
*/
class ProtvistaStructure extends HTMLElement {
  constructor() {
    super();
    this._mappings = [];

    this._planHighlight = this._planHighlight.bind(this);
    this.propagateHighlight = this.propagateHighlight.bind(this);
  }

  get css() {
    return `
    protvista-structure h4 {
      display: inline;
      margin-right: 1em;
    }
      
    .molstar-container {
      position: relative;
      height: ${this._height};
    }
    `;
  }

  get accession() {
    return this._accession;
  }

  set accession(accession) {
    this.setAttribute("accession", accession);
    return this._accession;
  }

  get pdbId() {
    return this._pdbID;
  }

  set pdbId(pdbId) {
    this.setAttribute("pdbid", pdbId);
    this._pdbID = pdbId;
  }

  get height() {
    return this.getAttribute("height");
  }

  connectedCallback() {
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }

    this._pdbId = this.getAttribute("pdb-id");
    this._accession = this.getAttribute("accession");
    this._height = this.getAttribute("height") || "480px";
    this._highlight =
      this.getAttribute("highlight") &&
      ProtvistaStructure._formatHighlight(this.getAttribute("highlight"));

    const style = document.createElement("style");
    style.innerHTML = this.css;
    this.appendChild(style);

    const molStarDiv = document.createElement("div");
    molStarDiv.className = "molstar-container";
    molStarDiv.id = "molstar-instance";
    this.appendChild(molStarDiv);
    this._molStar = new MolStar(molStarDiv, this.propagateHighlight);
  }

  disconnectedCallback() {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  static get observedAttributes() {
    return ["highlight", "pdb-id", "height"];
  }

  static _formatHighlight(highlightString) {
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

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      const value = parseFloat(newVal);
      this[`_${attrName}`] = typeof value === "number" ? newVal : value;

      switch (attrName) {
        case "pdb-id":
          if (newVal !== null) {
            this._pdbId = newVal;
            this.selectMolecule(this._pdbId);
          }
          break;

        case "accession":
          this._accession = newVal;
          break;

        case "highlight":
          this._highlight = ProtvistaStructure._formatHighlight(
            this.getAttribute("highlight")
          );
          break;

        case "height":
          this._height = newVal;
          break;

        default:
          break;
      }

      this._planHighlight(true);
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

  async loadPDBEntry(pdbId) {
    try {
      const data = await fetch(
        `https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${pdbId}`
      );
      return await data.json();
    } catch (e) {
      this._molStar.showMessage("Error", `Couldn't load PDB entry`);
      throw new Error(e);
    }
  }

  async selectMolecule(id) {
    const pdbEntry = await this.loadPDBEntry(id);
    const mappings = Object.values(pdbEntry)[0].UniProt[this._accession]
      ?.mappings;

    await this._molStar.loadPdb(id.toLowerCase());
    this._selectedMolecule = {
      id,
      mappings,
    };
    this._planHighlight();
  }

  processMapping(mappingData) {
    if (!Object.values(mappingData)[0].UniProt[this._accession]) {
      return null;
    }
    return Object.values(mappingData)[0].UniProt[this._accession].mappings;
  }

  translatePositions(start, end, direction = UP_PDB) {
    console.log(start, end, direction);
    // return if they have been set to 'undefined'
    if (
      typeof this.highlight === "string" ||
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
          (direction === UP_PDB &&
            start >= mapping.unp_start &&
            end <= mapping.unp_end) ||
          (direction === PDB_UP &&
            start >= mapping.start.residue_number &&
            end <= mapping.end.residue_number)
        ) {
          const offset = mapping.unp_start - mapping.start.residue_number;
          return {
            entity: mapping.entity_id,
            chain: mapping.chain_id,
            start: direction === "UP_PDB" ? start - offset : start + offset,
            end: direction === "UP_PDB" ? end - offset : end + offset,
          };
        }
      } else {
        this._molStar.showMessage(
          "Error",
          "Mismatch between protein sequence and structure residues"
        );
      }
    }
    return null;
  }

  propagateHighlight(sequencePosition) {
    if (!sequencePosition) {
      return;
    }
    // TODO: translate position
    // const seqPositions = e.data.residues
    //   .map((residue) =>
    //     this.translatePositions(residue.seqNumber, residue.seqNumber, PDB_UP)
    //   )
    //   .map((residue) => `${residue.start}:${residue.end}`);
    const event = new CustomEvent("change", {
      detail: {
        highlight: `${sequencePosition}:${sequencePosition + 1}`,
      },
      bubbles: true,
      cancelable: true,
    });
    console.log(event);
    this.dispatchEvent(event);
  }

  highlightChain() {
    if (!this._highlight) {
      return;
    }

    const translatedPositions = this._highlight
      .map(({ start, end }) => this.translatePositions(start, end))
      .filter(Boolean);

    if (!translatedPositions?.length) {
      return;
    }

    this._molStar.highlight(translatedPositions);
    this._molStar.clearMessages();
  }
}

export default ProtvistaStructure;
