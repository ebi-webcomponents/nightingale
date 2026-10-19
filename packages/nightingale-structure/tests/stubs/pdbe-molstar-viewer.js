// Stand-in for `pdbe-molstar/lib/viewer`. The real plugin pulls in the whole of
// molstar (a 4.5MB bundle) and needs WebGL, neither of which jsdom can carry, so
// the component's wiring is tested against this instead. Mapped in via
// `moduleNameMapper` in jest.config.js.

const { PluginConfig } = require("molstar/lib/mol-plugin/config");
const {
  MAQualityAssessment,
} = require("molstar/lib/extensions/model-archive/quality-assessment/behavior");

const asyncFn = () => jest.fn().mockResolvedValue(undefined);

class PDBeMolstarPlugin {
  constructor() {
    PDBeMolstarPlugin.instances.push(this);
    const instance = this;

    this.visual = {
      // The real method resolves `true` once the structure has loaded (`false`
      // for invalid params) and rejects when the load fails.
      update: jest.fn().mockResolvedValue(true),
      select: asyncFn(),
      clearSelection: asyncFn(),
      reset: asyncFn(),
      setColor: asyncFn(),
    };

    this.clear = asyncFn();

    // The real method returns the hierarchy's StructureRef, whose
    // `cell.obj.data` is the molstar Structure. This one stands for the
    // structure of the latest `visual.update()` (pending or not),
    // with a model shaped as far as pdbe-molstar's `SIFTSMapping.isAvailable`
    // reads it (see pdbe-molstar-sifts-mapping.js).
    this.getStructure = jest.fn(() => {
      const updates = this.visual.update.mock.calls;
      if (!updates.length) return undefined;
      const params = updates[updates.length - 1][0];
      const defined = { isDefined: PDBeMolstarPlugin.hasSifts(params) };
      const model = {
        sourceData: {
          kind: "mmCIF",
          data: {
            db: {
              atom_site: {
                pdbx_sifts_xref_db_name: defined,
                pdbx_sifts_xref_db_acc: defined,
                pdbx_sifts_xref_db_num: defined,
                pdbx_sifts_xref_db_res: defined,
              },
            },
          },
        },
      };
      return { cell: { obj: { data: { models: [model] } } } };
    });

    // The real one is molstar's PluginContext.
    const config = new Map();
    const behaviors = new Map();
    this.plugin = {
      handleResize: jest.fn(),
      dispose: jest.fn(),
      config: {
        get: (key) => config.get(key),
        set: (key, value) => config.set(key, value),
      },
      // The behaviours, by ref, as far as adding one to them goes. The real
      // `updateTree` returns a task, which `runTask` runs.
      state: {
        behaviors: {
          cells: behaviors,
          build() {
            const tree = {
              to: () => tree,
              apply(transformer, params, { ref }) {
                tree.added = [ref, { transformer, params }];
                return tree;
              },
            };
            return tree;
          },
          updateTree: (tree) => () => behaviors.set(...tree.added),
        },
      },
      runTask: jest.fn(async (task) => task()),
      // The registries a colour theme, the model property it colours by and
      // its hover label are added to. Each plugin has its own.
      customModelProperties: { register: jest.fn() },
      representation: {
        structure: { themes: { colorThemeRegistry: { add: jest.fn() } } },
      },
      managers: {
        lociLabels: { addProvider: jest.fn() },
        structure: {
          // The real `current.structures` are the loaded structures' refs,
          // each with its components. This one stands, as `getStructure` does,
          // for the structure of the latest `visual.update()`.
          hierarchy: {
            get current() {
              const updates = instance.visual.update.mock.calls;
              if (!updates.length) return { structures: [] };
              const params = updates[updates.length - 1][0];
              return { structures: [{ components: [{ params }] }] };
            },
          },
          // The real method sets the colour theme of the components'
          // representations, and resolves once they are updated.
          component: { updateRepresentationsTheme: asyncFn() },
        },
      },
    };

    // The component renders an empty viewer and loads every structure,
    // including the first, through `visual.update`.
    this.render = jest.fn(async (container, params) => {
      this.container = container;
      this.initParams = params;
      // pdbe-molstar sets up pLDDT colouring here, for an AlphaFold view only.
      if (params.alphafoldView) {
        behaviors.set(MAQualityAssessment.id, {
          transformer: MAQualityAssessment,
          params: { autoAttach: true, showTooltip: true },
        });
      }
      config.set(PluginConfig.Structure.DefaultRepresentationPresetParams, {
        theme: {
          globalName: params.alphafoldView ? "plddt-confidence" : undefined,
          carbonColor: { name: "element-symbol", params: {} },
        },
      });
    });
  }
}

PDBeMolstarPlugin.instances = [];

/**
 * Whether the file loaded for `params` has the atom_site.pdbx_sifts_xref_db_*
 * columns. By default as with the real files: PDBe's BinaryCIF, loaded by
 * `moleculeId`, has them; the files loaded by URL (`customData`: wwPDB
 * archive files, AlphaFold and other models) don't. Tests may replace it.
 */
PDBeMolstarPlugin.defaultHasSifts = (params) => !!params.moleculeId;
PDBeMolstarPlugin.hasSifts = PDBeMolstarPlugin.defaultHasSifts;

module.exports = { PDBeMolstarPlugin };
