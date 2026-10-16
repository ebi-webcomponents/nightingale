// Import the plugin class from `lib/viewer` (not `lib`): the `lib` entrypoint
// additionally imports an SCSS stylesheet as a side effect, which the bundler
// can't handle and which we don't want (the CSS is injected separately).
import { PDBeMolstarPlugin } from "pdbe-molstar/lib/viewer";
import { SIFTSMapping } from "pdbe-molstar/lib/sifts-mapping";
import type { InitParams } from "pdbe-molstar/lib/spec";
import type { QueryParam } from "pdbe-molstar/lib/helpers";
import type { EventDetail } from "pdbe-molstar/lib/loci-details";
import { MAQualityAssessment } from "molstar/lib/extensions/model-archive/quality-assessment/behavior";
import { PluginBehavior } from "molstar/lib/mol-plugin/behavior/behavior";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import type { PluginContext } from "molstar/lib/mol-plugin/context";
import type { ColorTheme } from "molstar/lib/mol-theme/color";

import {
  ALPHAMISSENSE_THEME,
  AlphaMissenseScores,
  registerAlphaMissenseTheme,
} from "./alphamissense";

export type { QueryParam } from "pdbe-molstar/lib/helpers";

/** Payload carried on the `PDB.molstar.click` DOM event (`event.eventData`). */
export type StructureClickEvent = EventDetail;

export type LoadSource =
  | { kind: "pdb"; id: string }
  | { kind: "url"; url: string; format?: string; binary?: boolean };

/**
 * How AlphaFold models are coloured: by pLDDT confidence, as pdbe-molstar
 * colours them when they load, or by mean AlphaMissense pathogenicity.
 */
export type StructureColorTheme =
  | { name: "plddt-confidence" }
  | { name: "alphamissense"; scores: AlphaMissenseScores };

export type StructureViewerOptions = {
  alphafold?: boolean;
  highlightColor?: string;
};

/** One item of a persistent selection: a region plus how to render it. */
export type SelectItem = QueryParam & {
  /** Overpaint color; `null` selects the region but keeps its theme color. */
  color?: string | null;
  opacity?: number;
  focus?: boolean;
};

export type StructureViewer = {
  instance: PDBeMolstarPlugin;
  load(source: LoadSource, options: StructureViewerOptions): Promise<void>;
  /** Remove the loaded structure, leaving an empty viewer. */
  clear(): Promise<void>;
  /**
   * Replace the selection with `data`, moving the camera to the items with
   * `focus`, and dim the rest of the structure to `nonSelectedOpacity`.
   * Selections run one at a time, in call order.
   */
  select(params: {
    data: SelectItem[];
    nonSelectedOpacity?: number;
  }): Promise<void>;
  clearHighlight(): Promise<void>;
  /**
   * Whether the loaded structure maps its residues to UniProt (SIFTS), as
   * pdbe-molstar's `uniprot_*` query params and the click payload's
   * `unp_accession`/`unp_seq_id` need. Only files with the
   * `atom_site.pdbx_sifts_xref_db_*` columns have it: PDBe's BinaryCIF
   * (`<id>.bcif`), which a PDB id loads, but not archive files or models
   * loaded by URL.
   */
  hasSiftsMapping(): boolean;
  /** Whether any of `params` matches part of the loaded structure. */
  matches(params: QueryParam[]): boolean;
  setHighlightColor(color: string): Promise<void>;
  /**
   * Colour the loaded structure by `theme`. Loading a structure resets it to
   * pdbe-molstar's default for it.
   */
  setColorTheme(theme: StructureColorTheme): Promise<void>;
  handleResize(): void;
  dispose(): void;
};

// pdbe-molstar colors have no alpha channel; strip a leading "#" and any trailing
// alpha so an 8-digit hex like "#FFEB3B66" becomes "#FFEB3B".
const toMolstarColor = (color?: string): string | undefined =>
  color ? `#${color.replace(/^#/, "").substring(0, 6)}` : undefined;

/**
 * Identifies the transparency layers pdbe-molstar's `select` creates for
 * `data` and `nonSelectedOpacity`: one for the whole structure, then one per
 * item with an `opacity`. An item's color and focus don't affect them.
 */
const opacityLayersKey = (
  data: SelectItem[],
  nonSelectedOpacity?: number,
): string =>
  JSON.stringify(
    data.length
      ? [
          nonSelectedOpacity ?? null,
          data
            .filter((d) => d.opacity !== undefined)
            .map((d) => ({ ...d, color: undefined, focus: undefined })),
        ]
      : [],
  );

const buildInitParams = (
  source: LoadSource | undefined,
  options: StructureViewerOptions,
): Partial<InitParams> => {
  const color = toMolstarColor(options.highlightColor);
  const base: Partial<InitParams> = {
    bgColor: { r: 0xee, g: 0xee, b: 0xee },
    hideControls: true,
    sequencePanel: false,
    landscape: false,
    pdbeLink: false,
    // Not needed for the PDB.molstar.click DOM event: `render()` always emits it
    // on the container. This flag only adds document listeners for other PDB
    // components' events, which pdbe-molstar never removes, so they would keep
    // every disposed viewer alive and reacting to page-wide events.
    subscribeEvents: false,
    selectInteraction: false, // we drive highlighting ourselves
    hideCanvasControls: [
      "animation",
      "selection",
      "controlToggle",
      "controlInfo",
    ],
    alphafoldView: !!options.alphafold,
    ...(color ? { highlightColor: color, selectColor: color } : {}),
  };
  if (!source) return base;
  if (source.kind === "pdb") {
    return { ...base, moleculeId: source.id.toLowerCase() };
  }
  return {
    ...base,
    customData: {
      url: source.url,
      format: source.format ?? "cif",
      binary: source.binary ?? false,
    },
  };
};

/**
 * Colour the structures `plugin` loads next by pLDDT confidence, as
 * pdbe-molstar colours AlphaFold models (`alphafoldView`), or not. pdbe-molstar
 * sets this up only in `render()`, for the structure the viewer is created
 * for, but a viewer goes on to load AlphaFold models and other structures in
 * turn.
 */
const setAlphaFoldView = async (
  plugin: PluginContext,
  alphafold: boolean,
): Promise<void> => {
  // Registers the pLDDT colour theme and hover label.
  if (alphafold && !plugin.state.behaviors.cells.has(MAQualityAssessment.id)) {
    const tree = plugin.state.behaviors
      .build()
      .to(PluginBehavior.getCategoryId(MAQualityAssessment))
      .apply(
        MAQualityAssessment,
        { autoAttach: true, showTooltip: true },
        { ref: MAQualityAssessment.id },
      );
    await plugin.runTask(plugin.state.behaviors.updateTree(tree));
  }
  // The preset pdbe-molstar loads every structure with.
  const preset = PluginConfig.Structure.DefaultRepresentationPresetParams;
  const params = plugin.config.get(preset) ?? {};
  plugin.config.set(preset, {
    ...params,
    theme: {
      ...params.theme,
      // Not one of molstar's built-in themes.
      globalName: alphafold
        ? ("plddt-confidence" as ColorTheme.BuiltIn)
        : undefined,
    },
  });
};

export const getStructureViewer = async (
  parent: HTMLElement,
  onClick: (event: StructureClickEvent) => void,
  source: LoadSource,
  options: StructureViewerOptions,
): Promise<StructureViewer> => {
  const instance = new PDBeMolstarPlugin();
  /** The scores the AlphaMissense theme colours by. */
  let alphaMissenseScores: AlphaMissenseScores = new Map();

  // pdbe-molstar's `render()` mounts its React UI with `createRoot(target)` and
  // never unmounts it, so each viewer gets a fresh target element, removed on
  // dispose: a later viewer must not create a second root on the same node.
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.inset = "0";
  parent.appendChild(container);

  // Render an empty viewer, then load the structure through `visual.update`.
  // Given a structure, `render()` starts loading it without awaiting or catching
  // the load, so a failed first load would be an unhandled rejection inside
  // pdbe-molstar; `visual.update` resolves once the structure (and its SIFTS
  // mapping) is loaded, rejects when the load fails, and resolves `false` for
  // invalid params.
  try {
    await instance.render(container, buildInitParams(undefined, options));
    registerAlphaMissenseTheme(instance.plugin, () => alphaMissenseScores);
    if (
      !(await instance.visual.update(buildInitParams(source, options), true))
    ) {
      throw new Error("Invalid structure parameters");
    }
  } catch (error) {
    container.remove();
    instance.plugin?.dispose();
    throw error;
  }

  // The residue payload is on `event.eventData`, not `event.detail`.
  const onContainerClick = (event: Event) => {
    const data = (event as unknown as { eventData?: StructureClickEvent })
      .eventData;
    if (data) onClick(data);
  };
  container.addEventListener("PDB.molstar.click", onContainerClick);

  // pdbe-molstar's `select` and `clearSelection` each await several state
  // updates; interleaved, one's layers can be added to the other's.
  let selecting: Promise<void> = Promise.resolve();
  const enqueue = (task: () => Promise<void>): Promise<void> => {
    const run = selecting.then(task);
    selecting = run.catch(() => undefined);
    return run;
  };
  /**
   * The `opacityLayersKey` of the transparency layers on the structure, or
   * undefined when unknown (e.g. after a failed selection).
   */
  let appliedOpacityLayers: string | undefined;
  /**
   * Bumped as a load or clear starts and ends: they replace the
   * representations, and the transparency layers with them.
   */
  let structureVersion = 0;
  const replaceStructure = async (task: () => Promise<unknown>) => {
    structureVersion += 1;
    appliedOpacityLayers = undefined;
    try {
      await task();
    } finally {
      structureVersion += 1;
      appliedOpacityLayers = undefined;
    }
  };

  return {
    instance,
    async load(nextSource, nextOptions) {
      await setAlphaFoldView(instance.plugin, !!nextOptions.alphafold);
      await replaceStructure(() =>
        instance.visual.update(buildInitParams(nextSource, nextOptions), true),
      );
    },
    async clear() {
      await replaceStructure(() => instance.clear());
    },
    select({ data, nonSelectedOpacity }) {
      return enqueue(async () => {
        // Rebuilding the transparency layers costs O(atoms) each, so they are
        // kept when unchanged, e.g. when only a highlighted range moves. Their
        // params are then left out: with `keepOpacity`, pdbe-molstar adds
        // layers to the existing ones rather than replacing them.
        const opacityLayers = opacityLayersKey(data, nonSelectedOpacity);
        const keepOpacity = opacityLayers === appliedOpacityLayers;
        const version = structureVersion;
        appliedOpacityLayers = undefined;
        // Use `select` (persistent overpaint) rather than `highlight` (which is
        // a transient hover marking that clears on mouse-move), so the selected
        // regions stay visible. This matches the original component, which
        // used Mol*'s persistent selection.
        await instance.visual.clearSelection(
          undefined,
          keepOpacity ? { keepOpacity } : undefined,
        );
        if (data.length) {
          await instance.visual.select({
            data: data.map(({ opacity, ...d }) => ({
              ...d,
              ...(keepOpacity || opacity === undefined ? {} : { opacity }),
              // `null` is pdbe-molstar's "select without recoloring" (it keeps
              // the theme color); the cast is needed as the published typings
              // only admit actual colors.
              color: (d.color === null ? null : toMolstarColor(d.color)) as
                | string
                | undefined,
            })),
            ...(keepOpacity ? { keepOpacity } : { nonSelectedOpacity }),
          });
        }
        if (version === structureVersion) appliedOpacityLayers = opacityLayers;
      });
    },
    clearHighlight() {
      return enqueue(async () => {
        appliedOpacityLayers = undefined;
        await instance.visual.clearSelection();
        await instance.visual.reset({ camera: true });
      });
    },
    hasSiftsMapping() {
      // The model pdbe-molstar's UniProt queries read the mapping from.
      const model = instance.getStructure(-1)?.cell.obj?.data.models[0];
      return !!model && SIFTSMapping.isAvailable(model);
    },
    matches(params) {
      // As `select` resolves its items. Matching nothing gives `EmptyLoci`
      // (no structure) or a `StructureElement.Loci` without units.
      const loci = instance.getLociForParams(params, -1);
      return loci.kind === "element-loci" && loci.elements.length > 0;
    },
    async setHighlightColor(color) {
      const c = toMolstarColor(color);
      await instance.visual.setColor({ highlight: c, select: c });
    },
    async setColorTheme(theme) {
      let color = "plddt-confidence";
      if (theme.name === "alphamissense") {
        alphaMissenseScores = theme.scores;
        color = ALPHAMISSENSE_THEME;
      }
      const { managers } = instance.plugin;
      for (const structure of managers.structure.hierarchy.current.structures) {
        // eslint-disable-next-line no-await-in-loop
        await managers.structure.component.updateRepresentationsTheme(
          structure.components,
          // Not one of molstar's built-in themes.
          { color: color as ColorTheme.BuiltIn },
        );
      }
    },
    handleResize() {
      instance.plugin.handleResize();
    },
    dispose() {
      container.removeEventListener("PDB.molstar.click", onContainerClick);
      instance.plugin.dispose();
      container.remove();
    },
  };
};
