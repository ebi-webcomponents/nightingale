/* eslint-disable class-methods-use-this */
import "whatwg-fetch";
import LiteMol from "litemol";
import MolStar from "./molstar";

const UP_PDB = "UP_PDB";
const PDB_UP = "PDB_UP";

class ProtvistaStructure extends HTMLElement {
  constructor() {
    super();
    this._mappings = [];

    this.loadMolecule = this.loadMolecule.bind(this);
    this.loadMolecule2 = this.loadMolecule2.bind(this);
    this._planHighlight = this._planHighlight.bind(this);
    this.propagateHighlight = this.propagateHighlight.bind(this);
  }

  get css() {
    return `
    :root {
      --blue: 0, 112, 155;
    }
  
    protvista-structure h4 {
      display: inline;
      margin-right: 1em;
    }
      
    .litemol-container {
      position: relative;
      height: ${this._height};
    }

    .molstar-container {
      position: relative;
      height: ${this._height};
    }

    .lm-viewport-controls {
      display: ${this.hideViewportControls ? "none" : "block"};
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

  get hideViewportControls() {
    return this.getAttribute("hide-viewport-controls");
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

    const litemolDiv = document.createElement("div");
    litemolDiv.className = "litemol-container";
    litemolDiv.id = "litemol-instance";
    this.messageContainer = document.createElement("span");
    this.appendChild(this.messageContainer);
    this.appendChild(litemolDiv);

    this.loadLiteMol();

    const molStarDiv = document.createElement("div");
    molStarDiv.className = "molstar-container";
    molStarDiv.id = "molstar-instance";
    this.molStarDiv = molStarDiv;
    this.appendChild(molStarDiv);

    this.loadMolStar();
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
          this._pdbId = newVal;
          this.selectMolecule(this._pdbId);
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
      this.addMessage(`Couldn't load PDB entry`);
      throw new Error(e);
    }
  }

  async selectMolecule(id) {
    const pdbEntry = await this.loadPDBEntry(id);
    const mappings = this.processMapping(pdbEntry);

    await this.loadMolecule(id);
    await this.loadMolecule2(id);
    this._selectedMolecule = {
      id,
      mappings,
    };
    this._planHighlight();
  }

  loadLiteMol() {
    const { Plugin } = LiteMol;
    this.Command = LiteMol.Bootstrap.Command;
    this.Query = LiteMol.Core.Structure.Query;
    this.Bootstrap = LiteMol.Bootstrap;
    this.Core = LiteMol.Core;
    this.Tree = this.Bootstrap.Tree;
    this.CoreVis = LiteMol.Visualization;
    this.Transformer = this.Bootstrap.Entity.Transformer;
    this.Visualization = this.Bootstrap.Visualization;
    this.Event = this.Bootstrap.Event;
    this.Context = Plugin.Components.Context;

    this._liteMol = Plugin.create({
      target: this.querySelector("#litemol-instance"),
      viewportBackground: "#fff",
      layoutState: {
        hideControls: true,
      },
      allowAnalytics: false,
    });

    this.Event.Molecule.ModelSelect.getStream(
      this._liteMol.context
    ).subscribe((e) => this.propagateHighlight(e));
  }

  loadMolStar() {
    this._molStar = new MolStar(this.molStarDiv, {
      layoutIsExpanded: false,
      layoutShowControls: false,
      layoutShowRemoteState: false,
      layoutShowSequence: false,
      layoutShowLog: false,
      layoutShowLeftPanel: false,

      viewportShowExpand: true,
      viewportShowSelectionMode: false,
      viewportShowAnimation: false,

      pdbProvider: "rcsb",
      emdbProvider: "rcsb",
    });

    this.molStarDiv.addEventListener("click", (e) => {
      console.log(e);
    });
  }

  loadMolecule2(_id) {
    this._molStar.loadPdb(_id.toLowerCase());
    console.log(this._molStar);
  }

  loadMolecule(_id) {
    this._liteMol.clear();

    const transform = this._liteMol.createTransform();

    transform
      .add(this._liteMol.root, this.Transformer.Data.Download, {
        url: `https://www.ebi.ac.uk/pdbe/coordinates/${_id.toLowerCase()}/full?encoding=BCIF`,
        type: "Binary",
        _id,
      })
      .then(
        this.Transformer.Data.ParseBinaryCif,
        {
          id: _id,
        },
        {
          isBinding: true,
          ref: "cifDict",
        }
      )
      .then(
        this.Transformer.Molecule.CreateFromMmCif,
        {
          blockIndex: 0,
        },
        {
          isBinding: true,
        }
      )
      .then(
        this.Transformer.Molecule.CreateModel,
        {
          modelIndex: 0,
        },
        {
          isBinding: false,
          ref: "model",
        }
      )
      .then(this.Transformer.Molecule.CreateMacromoleculeVisual, {
        polymer: true,
        polymerRef: "polymer-visual",
        het: true,
        water: true,
      });

    return this._liteMol.applyTransform(transform);
  }

  getTheme() {
    const colors = new Map();
    colors.set("Uniform", this.CoreVis.Color.fromRgb(207, 178, 178));
    colors.set("Selection", this.CoreVis.Color.fromRgb(255, 0, 0));
    colors.set("Highlight", this.CoreVis.Theme.Default.HighlightColor);
    return this.Visualization.Molecule.uniformThemeProvider(undefined, {
      colors,
    });
  }

  addMessage(message) {
    this.removeMessage();
    this._liteMol.command(this.Bootstrap.Command.Toast.Show, {
      key: "UPMessage",
      message,
      timeoutMs: 30 * 1000,
    });
  }

  removeMessage() {
    this._liteMol.command(this.Bootstrap.Command.Toast.Hide, {
      key: "UPMessage",
    });
  }

  processMapping(mappingData) {
    if (!Object.values(mappingData)[0].UniProt[this._accession]) {
      return null;
    }
    return Object.values(mappingData)[0].UniProt[this._accession].mappings;
  }

  translatePositions(start, end, direction = UP_PDB) {
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
          // TODO this is wrong because there are gaps in the PDB sequence
          return {
            entity: mapping.entity_id,
            chain: mapping.chain_id,
            start: direction === "UP_PDB" ? start - offset : start + offset,
            end: direction === "UP_PDB" ? end - offset : end + offset,
          };
        }
      } else {
        this.addMessage(
          "Mismatch between protein sequence and structure residues"
        );
      }
    }
    return null;
  }

  propagateHighlight(e) {
    if (!e.data || !e.data.residues) {
      return;
    }
    const seqPositions = e.data.residues
      .map((residue) =>
        this.translatePositions(residue.seqNumber, residue.seqNumber, PDB_UP)
      )
      .map((residue) => `${residue.start}:${residue.end}`);

    const event = new CustomEvent("change", {
      detail: {
        highlight: seqPositions.join(","),
      },
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
  }

  highlightChain() {
    if (!this._highlight) {
      return;
    }

    this.Command.Visual.ResetTheme.dispatch(this._liteMol.context, undefined);
    this.Command.Tree.RemoveNode.dispatch(
      this._liteMol.context,
      "sequence-selection"
    );

    const visual = this._liteMol.context.select("polymer-visual")[0];

    if (!visual) {
      return;
    }

    const translatedPositions = this._highlight
      .map(({ start, end }) => this.translatePositions(start, end))
      .filter((translatedPosition) => translatedPosition);

    if (!translatedPositions || translatedPositions.length === 0) {
      return;
    }

    const queries = translatedPositions.map((translatedPos) =>
      this.Query.sequence(
        translatedPos.entity.toString(),
        translatedPos.chain,
        {
          seqNumber: translatedPos.start,
        },
        {
          seqNumber: translatedPos.end,
        }
      )
    );

    const theme = this.getTheme();
    const transform = this._liteMol.createTransform();

    queries.forEach((query) =>
      transform.add(
        visual,
        this.Transformer.Molecule.CreateSelectionFromQuery,
        {
          query,
        },
        {
          ref: "sequence-selection",
        }
      )
    );

    this._liteMol.applyTransform(transform).then(() => {
      this.Command.Visual.UpdateBasicTheme.dispatch(this._liteMol.context, {
        visual,
        theme,
      });
    });
    this.removeMessage();
  }
}

export default ProtvistaStructure;
