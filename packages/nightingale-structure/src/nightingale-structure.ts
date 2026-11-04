/* eslint-disable class-methods-use-this */
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import DOMPurify from "dompurify";

import NightingaleElement, {
  withHighlight,
  withManager,
  customElementOnce,
} from "@nightingale-elements/nightingale-new-core";

// pdbe-molstar's stylesheet is imported as a string (see the package-local
// rollup config) and injected once as a global stylesheet so the viewer's
// canvas/viewport size correctly. nightingale renders into the light DOM.
import pdbeMolstarStyles from "pdbe-molstar/build/pdbe-molstar.css";

import {
  getStructureViewer,
  StructureViewer,
  StructureClickEvent,
  LoadSource,
  StructureViewerOptions,
  SelectItem,
} from "./structure-viewer";
import { AlphaMissenseScores, parseAlphaMissense } from "./alphamissense";

export type AlphaFoldPrediction = {
  modelEntityId: string;
  toolUsed?: string;
  providerId?: string;
  entityType?: string;
  isUniProt?: boolean;
  modelCreatedDate?: Date;
  sequenceVersionDate?: Date;
  globalMetricValue?: number;
  fractionPlddtVeryLow?: number;
  fractionPlddtLow?: number;
  fractionPlddtConfident?: number;
  fractionPlddtVeryHigh?: number;
  latestVersion?: number;
  allVersions?: number[];
  sequence?: string;
  sequenceStart?: number;
  sequenceEnd?: number;
  sequenceChecksum?: string;
  isUniProtReviewed?: boolean;
  gene?: string;
  uniprotAccession?: string;
  uniprotId?: string;
  uniprotDescription?: string;
  taxId?: number;
  organismScientificName?: string;
  isUniProtReferenceProteome?: boolean;
  bcifUrl?: string;
  cifUrl?: string;
  pdbUrl?: string;
  paeImageUrl?: string;
  msaUrl?: string;
  plddtDocUrl?: string;
  paeDocUrl?: string;
  amAnnotationsUrl?: string;
  amAnnotationsHg19Url?: string;
  amAnnotationsHg38Url?: string;
  chainId: string;
  isComplex?: boolean;
  assemblyType?: string;
  oligomericState?: string;
};
export type AlphaFoldPayload = AlphaFoldPrediction[];

const alphaFoldMappingUrl = "https://alphafold.ebi.ac.uk/api/prediction/";

/**
 * A structure to load. For an AlphaFold model, also the URL of its
 * AlphaMissense file, if it has one.
 */
type ResolvedSource = LoadSource & { alphaMissenseUrl?: string };

/** Attributes that determine which structure is loaded. */
const SOURCE_ATTRIBUTES = [
  "structure-id",
  "model-url",
  "protein-accession",
  "custom-download-url",
] as const;

const DEFAULT_ENTRY_EMPHASIS_OPACITY = 0.3;

const PDBE_MOLSTAR_STYLE_ID = "nightingale-pdbe-molstar-styles";

/**
 * How many AlphaMissense files an element keeps, the most recently used: a
 * page can go through any number of AlphaFold models.
 */
const ALPHAMISSENSE_FILES_KEPT = 4;

const CUSTOM_DOWNLOAD_URL_DEPRECATION =
  "nightingale-structure: custom-download-url is deprecated and will be removed in a future major version. " +
  "Files without SIFTS mapping, such as wwPDB archive files, can't be highlighted by protein-accession's UniProt positions. " +
  "Remove it to load the entry from PDBe.";

const escapeHtml = (value: unknown): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Message markup, with every interpolated value HTML-escaped: values come
 * from attributes and structure files, which the page may not control.
 */
const messageHtml = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): string =>
  strings.reduce(
    (markup, string, i) => markup + escapeHtml(values[i - 1]) + string,
  );

/**
 * The markup messages use; anything else is removed (DOMPurify's defaults
 * keep e.g. <style> and <form>, which would reach the host page).
 */
const MESSAGE_MARKUP = {
  ALLOWED_TAGS: ["span", "b", "br"],
  ALLOWED_ATTR: ["data-article-id"],
};

/**
 * Inject pdbe-molstar's stylesheet once where `element` is: into the shadow
 * root it is in, if any (the document's styles don't reach into one, leaving
 * the viewer's controls unstyled under its canvas), otherwise into the
 * document head.
 */
function ensurePdbeMolstarStyles(element: Element): void {
  if (typeof document === "undefined") return;
  const root = element.getRootNode();
  const target = root instanceof ShadowRoot ? root : document.head;
  if (target.querySelector(`#${PDBE_MOLSTAR_STYLE_ID}`)) return;
  const style = document.createElement("style");
  style.id = PDBE_MOLSTAR_STYLE_ID;
  style.textContent = pdbeMolstarStyles;
  target.appendChild(style);
}

/** Infer pdbe-molstar's `customData` format/binary flags from a file URL. */
function inferFormat(url: string): { format: string; binary: boolean } {
  const path = url.toLowerCase().split("?")[0];
  if (path.endsWith(".bcif")) return { format: "cif", binary: true };
  if (path.endsWith(".pdb") || path.endsWith(".ent"))
    return { format: "pdb", binary: false };
  return { format: "cif", binary: false };
}

/**
 * Load an AlphaFold model from its BinaryCIF file, which is smaller and
 * faster to parse than its mmCIF file, or from the mmCIF file if it has none.
 */
function alphaFoldModelSource(
  prediction: AlphaFoldPrediction,
): ResolvedSource | undefined {
  const alphaMissenseUrl = prediction.amAnnotationsUrl;
  if (prediction.bcifUrl) {
    return {
      kind: "url",
      url: prediction.bcifUrl,
      format: "cif",
      binary: true,
      alphaMissenseUrl,
    };
  }
  if (prediction.cifUrl) {
    return {
      kind: "url",
      url: prediction.cifUrl,
      format: "cif",
      binary: false,
      alphaMissenseUrl,
    };
  }
  return undefined;
}

@customElementOnce("nightingale-structure")
class NightingaleStructure extends withManager(
  withHighlight(NightingaleElement),
) {
  @property({ type: String })
  "protein-accession"?: string;

  @property({ type: String })
  "structure-id"?: string;

  /**
   * @deprecated Load PDB entries from PDBe instead: files from here usually
   * have no SIFTS mapping, so highlights can't use UniProt positions.
   */
  @property({ type: String })
  "custom-download-url"?: string;

  @property({ type: String })
  "model-url"?: string;

  /**
   * How AlphaFold models are coloured: by pLDDT confidence ("alphafold", the
   * default) or by AlphaMissense pathogenicity ("alphamissense").
   */
  @property({ type: String })
  "color-theme"?: string;

  /** Opt out of the default visual emphasis of the current entry. */
  @property({ type: Boolean })
  "hide-entry-emphasis" = false;

  /**
   * Comma-separated author chain IDs (`auth_asym_id`) that map to the current
   * entry, e.g. `"A,B"`. Enables the entry emphasis for structure files that
   * carry no SIFTS mapping (e.g. `model-url` loads): 3D-Beacons providers
   * publish them as `entities[].chain_ids` in the uniprot summary endpoint.
   * When set, these chains take precedence over the SIFTS accession lookup.
   */
  @property({ type: String })
  "entry-chains"?: string;

  /** Opacity applied to everything outside the emphasized entry. */
  @property({
    // A removed or empty attribute restores the default. Lit's Number
    // converter would give `null` or 0, which pdbe-molstar applies as full
    // transparency, hiding the rest of the structure.
    converter: (value) =>
      value?.trim() ? Number(value) : DEFAULT_ENTRY_EMPHASIS_OPACITY,
  })
  "entry-emphasis-opacity" = DEFAULT_ENTRY_EMPHASIS_OPACITY;

  @state()
  message?: { title: string; content: string } | null = null;

  #structureViewer?: StructureViewer;

  /** True while #initViewer is creating the viewer. */
  #initializing = false;

  /**
   * Bumped by every init or reload, and by disconnecting: only the latest
   * one may update the viewer, the messages or the selection.
   */
  #generation = 0;

  /**
   * True once the viewer shows the structure the attributes ask for. False
   * while a reload is in flight and after one failed, when the viewer shows
   * a previous structure or none: highlights and clicks would be numbered
   * for the wrong structure, and pdbe-molstar's selection can fail mid-load.
   */
  #structureLoaded = false;

  /**
   * The viewer's load in flight, if any (settled; never rejects). Reloads
   * run one at a time: pdbe-molstar loads started close together can both
   * finish, leaving both structures displayed.
   */
  #pendingLoad?: Promise<void>;

  /** The #sourceKey of the latest init or reload. */
  #requestedSourceKey?: string;

  /** The AlphaMissense file of the AlphaFold model loaded, if it has one. */
  #alphaMissenseUrl?: string;

  /**
   * The most recently used AlphaMissense files by URL, least recent first. A
   * file is fetched again only once it has been dropped from here.
   */
  #alphaMissenseScores = new Map<string, Promise<AlphaMissenseScores>>();

  /** The message reporting that AlphaMissense colouring failed, if shown. */
  #colorThemeError?: { title: string; content: string };

  /** Whether a selection is applied that clearing it must undo. */
  #selectionApplied = false;

  /** The note that the highlight isn't in the structure, if shown. */
  #outOfRangeNote?: { title: string; content: string };

  /** The message reporting #lacksUniProtMapping, if shown. */
  #noUniProtMappingError?: { title: string; content: string };

  constructor() {
    super();
    this.updateHighlight = this.updateHighlight.bind(this);
  }

  protected override render() {
    return html`<style>
        nightingale-structure {
          width: 100%;
        }

        .structure-viewer-container {
          position: relative;
          height: var(--custom-structure-height, 480px);
        }

        .structure-viewer-canvas {
          position: absolute;
          inset: 0;
        }

        .structure-viewer-messages {
          opacity: 0.75;
          position: absolute;
          right: 0;
          bottom: 0;
          border: 1px solid gray;
          padding: 1ch;
          z-index: 1;
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
      <div class="structure-viewer-container">
        <!-- pdbe-molstar owns this node's DOM; it must contain NO Lit dynamic
             parts, or molstar's DOM manipulation ejects Lit's markers and breaks
             subsequent re-renders. The message overlay is a sibling, not a child. -->
        <div id="molstar-parent" class="structure-viewer-canvas"></div>
        ${this.message && this.#label()
          ? html`<div class="structure-viewer-messages">
              <span>${this.message?.title}</span>:
              <span
                class="structure-viewer-message-content"
                .innerHTML=${DOMPurify.sanitize(
                  this.message?.content ?? "",
                  MESSAGE_MARKUP,
                )}
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

  protected override updated(
    changedProperties: Map<PropertyKey, unknown>,
  ): void {
    if (
      changedProperties.has("custom-download-url") &&
      this["custom-download-url"]
    ) {
      console.warn(CUSTOM_DOWNLOAD_URL_DEPRECATION);
    }
    const sourceChanged = SOURCE_ATTRIBUTES.some((name) =>
      changedProperties.has(name),
    );
    if (!this.#structureViewer) {
      // Create the viewer as soon as the attributes give a source. Changes made
      // while an init is in flight are picked up when it completes.
      if (sourceChanged) this.#initViewer();
      return;
    }
    // Only reload when the structure to load changed: protein-accession
    // alone changes it for AlphaFold ids only, but changes how highlights
    // are numbered on any structure.
    if (sourceChanged && this.#sourceKey() !== this.#requestedSourceKey) {
      this.#reload();
    }
    if (changedProperties.has("color-theme")) {
      this.#applyColorTheme();
    }
    if (changedProperties.has("highlight-color")) {
      // Update the hover/selection-mode color. This leaves the selection and
      // the camera alone, unlike clearing a highlight.
      this.#structureViewer
        .setHighlightColor(this["highlight-color"])
        .catch(() => undefined);
    }
    if (
      changedProperties.has("highlight") ||
      changedProperties.has("hide-entry-emphasis") ||
      changedProperties.has("entry-emphasis-opacity") ||
      changedProperties.has("entry-chains")
    ) {
      this.#applySelection(true);
    } else if (
      changedProperties.has("protein-accession") ||
      (this.highlight && changedProperties.has("highlight-color"))
    ) {
      // Re-apply the persistent selection in its new color, numbering or
      // entry chains, leaving the camera where the user may have moved it.
      this.#applySelection(false);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    // On every connection: the element may have moved into another root.
    ensurePdbeMolstarStyles(this);
    // Re-appended after a disconnect disposed the viewer: create a new one. The
    // first connection is handled by the first update.
    if (this.hasUpdated) this.#initViewer();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Inits and reloads in flight are now stale.
    this.#generation += 1;
    this.#structureLoaded = false;
    this.#pendingLoad = undefined;
    this.#structureViewer?.dispose();
    this.#structureViewer = undefined;
  }

  isAF(): boolean {
    return this["structure-id"]?.startsWith("AF-") ?? false;
  }

  /**
   * Look up the model file of the AlphaFold DB prediction for the current
   * accession + structure id.
   */
  async #resolveAlphaFoldSource(
    generation: number,
  ): Promise<ResolvedSource | undefined> {
    const accession = this["protein-accession"];
    const id = this["structure-id"];
    if (!accession) {
      // Rather than an empty viewer with no explanation. Setting it reloads.
      this.showMessage(
        "Error",
        messageHtml`Set protein-accession to load AF entry "${id}"`,
      );
      return undefined;
    }
    this.showMessage("Loading", messageHtml`${id || accession}`);
    // Errors only while this lookup is still current: a structure set
    // meanwhile may already be loaded, and must not be covered by them.
    const isCurrent = () =>
      generation === this.#generation &&
      this["structure-id"] === id &&
      this["protein-accession"] === accession;
    try {
      const predictions: AlphaFoldPayload = await fetch(
        `${alphaFoldMappingUrl}${accession}`,
      ).then((r) => r.json());
      const info = predictions.find(
        (prediction) => prediction.modelEntityId === id,
      );
      if (!info) {
        if (isCurrent()) {
          this.showMessage(
            "Error",
            messageHtml`No AF entry "${id}" for ${accession}`,
          );
        }
        return undefined;
      }
      const source = alphaFoldModelSource(info);
      if (!source && isCurrent()) {
        this.showMessage(
          "Error",
          messageHtml`No model file for AF entry "${id}"`,
        );
      }
      return source;
    } catch (e) {
      if (isCurrent()) {
        this.showMessage("Error", messageHtml`Couldn't load AF entry "${id}"`);
      }
      return undefined;
    }
  }

  /** Build the load source for the viewer from the current attributes. */
  async #resolveSource(generation: number): Promise<ResolvedSource | null> {
    if (this["structure-id"] && this["model-url"]) {
      console.error(
        "Structure ID and Model URL both are present. Provide only one that you would want to take precedence",
      );
      return null;
    }
    if (this["model-url"]) {
      return {
        kind: "url",
        url: this["model-url"],
        ...inferFormat(this["model-url"]),
      };
    }
    if (this["structure-id"]) {
      if (this.isAF()) {
        return (await this.#resolveAlphaFoldSource(generation)) ?? null;
      }
      const id = this["structure-id"];
      if (this["custom-download-url"]) {
        return {
          kind: "url",
          url: `${this["custom-download-url"]}${id.toLowerCase()}.cif`,
          format: "cif",
          binary: false,
        };
      }
      return { kind: "pdb", id };
    }
    return null;
  }

  /**
   * Identifies the structure the attributes ask for: the attributes
   * #resolveSource reads for it, so that a change to any other (e.g.
   * custom-download-url while a model-url is shown) doesn't reload.
   */
  #sourceKey(): string {
    const id = this["structure-id"] ?? "";
    const url = this["model-url"] ?? "";
    // Both set is an error, and loads nothing.
    if (id && url) return JSON.stringify(["both", id, url]);
    if (url) return JSON.stringify(["url", url]);
    if (!id) return "";
    // Only AlphaFold models are looked up by protein-accession, and only PDB
    // entries are downloaded from custom-download-url.
    return this.isAF()
      ? JSON.stringify(["alphafold", id, this["protein-accession"] ?? ""])
      : JSON.stringify(["pdb", id, this["custom-download-url"] ?? ""]);
  }

  #resolveOptions(): StructureViewerOptions {
    return {
      alphafold: this.isAF(),
      highlightColor: this["highlight-color"],
    };
  }

  async #initViewer(): Promise<void> {
    const container =
      this.renderRoot.querySelector<HTMLDivElement>("#molstar-parent");
    if (
      !container ||
      !this.isConnected ||
      this.#initializing ||
      this.#structureViewer
    ) {
      return;
    }
    this.#initializing = true;
    const generation = ++this.#generation;
    // Attributes can change while the source resolves and the first load runs;
    // remember what this init was for so it can catch up afterwards.
    const sourceKey = this.#sourceKey();
    const options = this.#resolveOptions();
    let viewer: StructureViewer | undefined;
    let source: ResolvedSource | null = null;
    try {
      source = await this.#resolveSource(generation);
      // Attributes changed while the source resolved (e.g. during an AlphaFold
      // lookup) ask for another structure: don't load this one; the init is
      // started again for that one below.
      if (
        source &&
        generation === this.#generation &&
        this.#sourceKey() === sourceKey
      ) {
        viewer = await getStructureViewer(
          container,
          this.updateHighlight,
          source,
          options,
        );
      }
    } catch (e) {
      if (generation === this.#generation) {
        this.showMessage(
          "Error",
          messageHtml`Couldn't load structure "${this.#label()}"`,
        );
      }
    } finally {
      this.#initializing = false;
    }
    // Only a disconnect bumps the generation during an init. If the element
    // was re-appended since, that connection's init was skipped while this one
    // ran, and the viewer is still in place: keep it.
    if (generation !== this.#generation && !(viewer && this.isConnected)) {
      // Don't keep a detached WebGL context alive.
      viewer?.dispose();
      this.#initViewer();
      return;
    }
    if (!viewer) {
      // No source (yet): the attributes may have changed to one that resolves.
      if (this.#sourceKey() !== sourceKey) this.#initViewer();
      return;
    }
    this.#structureViewer = viewer;
    this.#requestedSourceKey = sourceKey;
    this.#structureLoaded = true;
    this.#alphaMissenseUrl = source?.alphaMissenseUrl;
    this.clearMessage();
    if (this["highlight-color"] !== options.highlightColor) {
      viewer.setHighlightColor(this["highlight-color"]).catch(() => undefined);
    }
    this.#selectionApplied = false;
    if (this.#sourceKey() !== sourceKey) {
      await this.#reload();
      return;
    }
    this.#applyColorTheme(true);
    this.#applySelection(true);
  }

  async #reload(): Promise<void> {
    const viewer = this.#structureViewer;
    if (!viewer) return;
    const generation = ++this.#generation;
    this.#requestedSourceKey = this.#sourceKey();
    // Until the new structure has loaded, the viewer doesn't show what the
    // attributes ask for.
    this.#structureLoaded = false;
    this.clearMessage();
    const source = await this.#resolveSource(generation);
    if (generation !== this.#generation) return;
    if (!source) {
      // Nothing to load (e.g. no such AlphaFold model): empty the viewer
      // rather than leave the previous structure up. Wait for a load still in
      // flight first, or it could finish after the clear and show its structure.
      await this.#pendingLoad;
      if (generation !== this.#generation) return;
      await viewer.clear().catch(() => undefined);
      return;
    }
    const label = this.#label();
    this.showMessage("Loading", messageHtml`${label}`);
    // Start loading only once the previous load has finished (see
    // #pendingLoad). Newer reloads meanwhile supersede this one.
    await this.#pendingLoad;
    if (generation !== this.#generation) return;
    const load = viewer.load(source, this.#resolveOptions());
    const pendingLoad = load.then(
      () => undefined,
      () => undefined,
    );
    this.#pendingLoad = pendingLoad;
    try {
      await load;
    } catch (e) {
      // Only the latest load reports.
      if (generation === this.#generation) {
        this.showMessage(
          "Error",
          messageHtml`Couldn't load structure "${label}"`,
        );
      }
      return;
    } finally {
      if (this.#pendingLoad === pendingLoad) this.#pendingLoad = undefined;
    }
    if (generation !== this.#generation) return;
    this.#structureLoaded = true;
    this.#alphaMissenseUrl = source.alphaMissenseUrl;
    this.clearMessage();
    this.#selectionApplied = false;
    this.#applyColorTheme(true);
    this.#applySelection(true);
  }

  /**
   * Colour the AlphaFold model loaded as `color-theme` asks. `loaded`: it has
   * just loaded, so pdbe-molstar has coloured it by pLDDT confidence.
   */
  async #applyColorTheme(loaded = false): Promise<void> {
    const viewer = this.#structureViewer;
    // Otherwise applied once the load in flight completes.
    if (!viewer || !this.#structureLoaded || !this.isAF()) return;
    // A theme that fails to apply is replaced by the next one.
    const ignore = () => undefined;
    if (this["color-theme"] !== "alphamissense") {
      if (this.message && this.message === this.#colorThemeError) {
        this.clearMessage();
      }
      if (!loaded) {
        await viewer.setColorTheme({ name: "plddt-confidence" }).catch(ignore);
      }
      return;
    }
    const generation = this.#generation;
    // Only while this model is loaded and the theme still asked for.
    const isCurrent = () =>
      generation === this.#generation &&
      this["color-theme"] === "alphamissense";
    const url = this.#alphaMissenseUrl;
    if (!url) {
      this.#colorThemeError = this.showMessage(
        "Error",
        messageHtml`No AlphaMissense data for "${this.#label()}"`,
      );
      return;
    }
    let scores: AlphaMissenseScores;
    try {
      scores = await this.#fetchAlphaMissense(url);
    } catch (e) {
      if (isCurrent()) {
        this.#colorThemeError = this.showMessage(
          "Error",
          messageHtml`Couldn't load AlphaMissense data for "${this.#label()}"`,
        );
      }
      return;
    }
    if (!isCurrent()) return;
    await viewer.setColorTheme({ name: "alphamissense", scores }).catch(ignore);
  }

  /** The scores in the AlphaMissense file at `url`. */
  #fetchAlphaMissense(url: string): Promise<AlphaMissenseScores> {
    const files = this.#alphaMissenseScores;
    let scores = files.get(url);
    if (scores) {
      // Now the most recently used.
      files.delete(url);
    } else {
      const fetched = fetch(url).then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseAlphaMissense(await response.text());
      });
      // Fetched again the next time it is needed, unless already replaced.
      fetched.catch(() => {
        if (files.get(url) === fetched) files.delete(url);
      });
      scores = fetched;
    }
    files.set(url, scores);
    for (const oldest of files.keys()) {
      if (files.size <= ALPHAMISSENSE_FILES_KEPT) break;
      files.delete(oldest);
    }
    return scores;
  }

  /**
   * The structure the attributes ask for, as shown in messages. Messages are
   * only shown while there is one.
   */
  #label(): string {
    return this["structure-id"] || this["model-url"] || "";
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
    return message;
  }

  private clearMessage() {
    this.message = null;
  }

  /**
   * Whether highlights and clicks are numbered in protein-accession's UniProt
   * sequence and mapped to the structure by its SIFTS mapping. Otherwise they
   * are author residue numbers, which AlphaFold and other models (e.g.
   * SwissModel, 3D-Beacons) number by UniProt position: a `range=30-189`
   * model is numbered 30..189. Without protein-accession there is no UniProt
   * sequence to number in, so PDB entries use author numbers too; with it,
   * those without SIFTS mapping aren't numbered (see #lacksUniProtMapping).
   */
  #usesSifts(): boolean {
    return (
      !!this["protein-accession"] && !!this.#structureViewer?.hasSiftsMapping()
    );
  }

  /**
   * Whether highlights and clicks are UniProt positions the structure can't
   * be numbered in: protein-accession is set for a PDB entry whose file has
   * no SIFTS mapping, such as a wwPDB archive file from custom-download-url.
   * Unlike a model's (see #usesSifts), an entry's author residue numbers are
   * rarely its UniProt positions, so they aren't used instead.
   */
  #lacksUniProtMapping(): boolean {
    return (
      !!this["protein-accession"] &&
      !!this["structure-id"] &&
      !this.isAF() &&
      !this.#usesSifts()
    );
  }

  #showNoUniProtMapping(): void {
    this.#noUniProtMappingError = this.showMessage(
      "Error",
      messageHtml`Can't map ${this["protein-accession"]} positions: this file has no SIFTS mapping`,
    );
  }

  /** Handle a residue click coming from pdbe-molstar. */
  updateHighlight(event: StructureClickEvent): void {
    // A click on a structure that is being replaced would be numbered by the
    // new attributes.
    if (!event || !this.#structureLoaded) return;
    if (this.#lacksUniProtMapping()) {
      this.#showNoUniProtMapping();
      return;
    }
    const accession = this["protein-accession"];
    let position: number | undefined;
    if (this.#usesSifts()) {
      // The SIFTS mapping is the clicked chain's own: a residue of another
      // protein in the entry (e.g. a binding partner) is numbered in that
      // protein's sequence, not protein-accession's.
      position =
        event.unp_accession === accession ? event.unp_seq_id : undefined;
    } else {
      // As highlightChain interprets them.
      position = event.auth_seq_id;
    }
    if (position === undefined || !Number.isInteger(position)) {
      this.showMessage("Error", "Residue outside of UniProt sequence range");
      return;
    }
    const highlight = `${position}:${position}`;
    this.highlight = highlight;

    const chain = event.auth_asym_id ?? event.label_asym_id ?? "";
    // Without protein-accession, position is an author residue number.
    const tooltipLabel = accession || "Residue";
    const tooltip = messageHtml`<span data-article-id="structure_section#description-of-structure-table-contents">Chain</span> ${chain}<br /><b>${tooltipLabel}</b>: ${position}`;
    this.showMessage(this.#label(), tooltip);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { highlight },
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  /**
   * Apply the current `highlight` ranges and the entry emphasis to the
   * structure, moving the camera to them.
   */
  highlightChain(): void {
    this.#applySelection(true);
  }

  /**
   * Items emphasizing the current entry: they keep their theme colors while
   * everything else is dimmed. Whole chains from `entry-chains` when
   * provided, and otherwise the residues matched by pdbe-molstar's
   * per-residue, SIFTS-based `uniprot_accession` predicate — which only
   * resolves for structures carrying `pdbx_sifts_xref_*` columns (PDBe
   * updated mmCIF/BinaryCIF), so other files (e.g. `model-url` models,
   * archive files from `custom-download-url`) are skipped unless
   * `entry-chains` names their chains. AlphaFold models are always skipped,
   * including AlphaFold DB models loaded by `model-url`: their pLDDT colouring
   * must stay untouched.
   * So are items that match nothing in the structure (an accession it doesn't
   * contain, absent chains): pdbe-molstar would still dim all of it.
   */
  #entryEmphasisItems(viewer: StructureViewer): SelectItem[] {
    if (this.#showsAlphaFoldModel(viewer)) return [];
    const items = this.#entryEmphasisQuery();
    return items.length && viewer.matches(items) ? items : [];
  }

  /**
   * Whether `viewer` shows an AlphaFold model: one loaded by AlphaFold DB id,
   * or an AlphaFold DB model file loaded by `model-url` (e.g. a complex),
   * which the viewer colours by pLDDT confidence too.
   */
  #showsAlphaFoldModel(viewer: StructureViewer): boolean {
    return this.isAF() || viewer.isAlphaFoldModel();
  }

  #entryEmphasisQuery(): SelectItem[] {
    if (this["hide-entry-emphasis"]) return [];
    // `opacity: 1` is required: `nonSelectedOpacity` dims the whole structure
    // and only items carrying an explicit opacity are exempt from that layer.
    const chains = this["entry-chains"]
      ?.split(",")
      .map((chain) => chain.trim())
      .filter(Boolean);
    if (chains?.length) {
      return chains.map((chain) => ({
        auth_asym_id: chain,
        color: null,
        opacity: 1,
      }));
    }
    const accession = this["protein-accession"];
    if (!accession || !this.#usesSifts()) return [];
    return [{ uniprot_accession: accession, color: null, opacity: 1 }];
  }

  /**
   * `entry-emphasis-opacity` in [0, 1], or its default when it isn't a number
   * or a numeric string (e.g. `null` or `undefined` set by a framework
   * binding).
   */
  #entryEmphasisOpacity(): number {
    const value: unknown = this["entry-emphasis-opacity"];
    // Framework bindings may set the property to a numeric string, e.g. "0.5".
    const opacity =
      typeof value === "string" && value.trim() ? Number(value) : value;
    return typeof opacity === "number" && Number.isFinite(opacity)
      ? Math.min(Math.max(opacity, 0), 1)
      : DEFAULT_ENTRY_EMPHASIS_OPACITY;
  }

  /**
   * Compute and apply the full persistent selection — entry-chain emphasis
   * plus the current `highlight` ranges — as a single `select` call, since
   * each call replaces the previous selection. The camera moves to it if
   * `focus` is set.
   */
  #applySelection(focus: boolean): void {
    const viewer = this.#structureViewer;
    // Otherwise applied once the load in flight completes.
    if (!viewer || !this.#structureLoaded) return;
    if (
      this.message &&
      (this.message === this.#outOfRangeNote ||
        this.message === this.#noUniProtMappingError)
    ) {
      this.clearMessage();
    }
    const accession = this["protein-accession"];
    const af = this.#showsAlphaFoldModel(viewer);
    const sifts = this.#usesSifts();
    // Rather than highlight whichever residues have these author numbers.
    const unmapped = !!this.highlight && this.#lacksUniProtMapping();
    if (unmapped) this.#showNoUniProtMapping();
    const rangeItems: SelectItem[] =
      !this.highlight || unmapped
        ? []
        : this.highlightedRegion.segments.map(({ start, end }) => ({
            ...(sifts
              ? // UniProt sequence space — pdbe-molstar maps to PDB residues via
                // SIFTS.
                {
                  uniprot_accession: accession,
                  start_uniprot_residue_number: start,
                  end_uniprot_residue_number: end,
                }
              : // Author residue numbering (see #usesSifts). `label_seq_id` is
                // 1-based and would not match a model numbered from 30, so use
                // auth numbers.
                { beg_auth_seq_id: start, end_auth_seq_id: end }),
            // On AlphaFold models the pLDDT colouring is the most important
            // information, so the range is not overpainted (`color: null` keeps
            // the theme); it is shown by dimming everything else instead.
            // Elsewhere it carries no opacity, so that the dimming doesn't depend
            // on it and a highlight change leaves it in place (see the viewer's
            // `select`): a range on a dimmed chain is overpainted but stays dim.
            ...(af
              ? { color: null, opacity: 1 }
              : { color: this["highlight-color"] }),
            focus,
          }));
    // None of the highlight is in the structure (e.g. a feature outside the
    // part of the protein an entry covers): say so, rather than seem to ignore
    // it, and leave the camera where it is. A range partly in the structure is
    // highlighted where it is.
    const outOfRange = rangeItems.length > 0 && !viewer.matches(rangeItems);
    if (outOfRange) {
      const ranges = this.highlightedRegion.segments
        .map(({ start, end }) =>
          start === end ? `${start}` : `${start}–${end}`,
        )
        .join(", ");
      this.#outOfRangeNote = this.showMessage(
        this.#label(),
        messageHtml`Not in this structure: ${sifts ? `${accession} ` : ""}${ranges}`,
      );
    }
    const highlightItems = outOfRange ? [] : rangeItems;
    const moveCamera = focus && !outOfRange;
    const entryItems = this.#entryEmphasisItems(viewer).map((item) => ({
      ...item,
      // Frame the entry's chains only when no highlighted range will focus.
      focus: moveCamera && highlightItems.length === 0,
    }));
    const data = [...entryItems, ...highlightItems];
    // A failed selection is replaced by the next one; it needs no handling.
    const ignore = () => undefined;
    if (data.length === 0) {
      // Only clear (which also resets the camera) if a selection was applied
      // before; otherwise e.g. an AlphaFold load would get a spurious camera
      // reset right after its initial framing. Without `moveCamera`, only the
      // selection is cleared.
      if (this.#selectionApplied) {
        (moveCamera ? viewer.clearHighlight() : viewer.select({ data })).catch(
          ignore,
        );
        this.#selectionApplied = false;
      }
      return;
    }
    // Dim the rest of the structure when emphasizing the entry's chains, and
    // for a highlight on an AlphaFold model (where the dim IS the highlight).
    const dimOthers =
      entryItems.length > 0 || (af && highlightItems.length > 0);
    viewer
      .select({
        data,
        nonSelectedOpacity: dimOthers
          ? this.#entryEmphasisOpacity()
          : undefined,
      })
      .catch(ignore);
    this.#selectionApplied = true;
  }
}

export default NightingaleStructure;
