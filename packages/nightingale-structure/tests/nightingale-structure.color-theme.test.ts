// Under jest's transpile-only ts-jest the CJS dompurify's default import is
// undefined, so render() would throw whenever a message is shown while
// structure-id is set. Production builds use the ESM bundle.
jest.mock("dompurify", () => ({
  __esModule: true,
  default: { sanitize: (s: string) => s },
}));

import NightingaleStructure from "../src/index";
import { ALPHAMISSENSE_THEME } from "../src/alphamissense";
import { MAQualityAssessment } from "molstar/lib/extensions/model-archive/quality-assessment/behavior";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PDBeMolstarPlugin } = require("./stubs/pdbe-molstar-viewer.js");

/** Let the lit update cycle, fetches and the viewer's async init settle. */
const settle = async () => {
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 0));
  }
};

const mount = (attributes: Record<string, string>) => {
  const element = new NightingaleStructure();
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  document.documentElement.appendChild(element);
  return element;
};

/** The only viewer created. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const viewer = (): any => {
  expect(PDBeMolstarPlugin.instances).toHaveLength(1);
  return PDBeMolstarPlugin.instances[0];
};

const csvUrl = (id: string) => `https://example.org/${id}-aa-substitutions.csv`;

const prediction = (id: string, fields: object = {}) => ({
  modelEntityId: id,
  chainId: "A",
  bcifUrl: `https://example.org/${id}-model.bcif`,
  amAnnotationsUrl: csvUrl(id),
  ...fields,
});

/** An AlphaMissense file scoring residue 1 `first` and residue 2 `second`. */
const csv = (first: number, second: number) =>
  [
    "protein_variant,am_pathogenicity,am_class",
    `M1A,${first - 0.1},LBen`,
    `M1C,${first + 0.1},LBen`,
    `L2A,${second},LPath`,
  ].join("\n");

type Response = { status: number; body: string };
type File = string | Error | Response | Promise<string>;

/**
 * Answer the AlphaFold API with `predictions`, and other fetches with
 * `files[url]`: a body, a network error, an HTTP response, or a promise of a
 * body or an error. Other URLs are 404s.
 */
const serve = (predictions: object[], files: Record<string, File> = {}) => {
  global.fetch = jest.fn(async (url: string) => {
    if (url.startsWith("https://alphafold.ebi.ac.uk/api/prediction/")) {
      return { ok: true, json: async () => predictions };
    }
    const file = await files[url];
    if (file instanceof Error) throw file;
    if (file === undefined) {
      return { ok: false, status: 404, text: async () => "Not found" };
    }
    if (typeof file === "object") {
      const { status, body } = file;
      return { ok: status < 300, status, text: async () => body };
    }
    return { ok: true, status: 200, text: async () => file };
  }) as unknown as typeof fetch;
};

/** A file whose fetch is answered by calling `answer` with its body. */
const deferredFile = () => {
  let answer: (file: string | Error) => void = () => undefined;
  const file = new Promise<string>((resolve, reject) => {
    answer = (body) => (body instanceof Error ? reject(body) : resolve(body));
  });
  return { file, answer: (body: string | Error) => answer(body) };
};

const csvFetches = () =>
  (global.fetch as jest.Mock).mock.calls
    .map(([url]) => url)
    .filter((url: string) => url.endsWith(".csv"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const themeUpdates = (instance: any) =>
  instance.plugin.managers.structure.component.updateRepresentationsTheme;

/** The colour themes applied to `instance`'s structure, in order. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const themes = (instance: any): string[] =>
  themeUpdates(instance).mock.calls.map(
    ([, params]: [unknown, { color: string }]) => params.color,
  );

/** Whether the latest theme was applied after the latest load. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const themedAfterLoad = (instance: any) =>
  Math.max(...themeUpdates(instance).mock.invocationCallOrder) >
  Math.max(...instance.visual.update.mock.invocationCallOrder);

/**
 * The scores the AlphaMissense theme colours a model of residues 1 and 2
 * (one atom each) by, by atom: what its model property computes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const coloured = async (instance: any) => {
  const [[provider]] =
    instance.plugin.customModelProperties.register.mock.calls;
  const model = {
    atomicHierarchy: {
      atoms: { _rowCount: 2 },
      residueAtomSegments: { index: [0, 1] },
      residues: { auth_seq_id: { value: (i: number) => i + 1 } },
    },
    customProperties: { add() {}, assets() {}, reference() {} },
    _dynamicPropertyData: {},
  };
  await provider.attach({}, model);
  const scores: Map<number, number> = provider.get(model).value;
  return [...scores].map(([atom, score]) => [atom, +score.toFixed(3)]);
};

const AF = { "protein-accession": "P05067", "structure-id": "AF-P05067-F1" };

describe("nightingale-structure color-theme", () => {
  let element: NightingaleStructure | undefined;

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
  });

  afterEach(() => {
    if (element?.isConnected) document.documentElement.removeChild(element);
    element = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch;
  });

  test("alphamissense colours an AlphaFold model by its AlphaMissense file", async () => {
    serve([prediction("AF-P05067-F1")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
    });
    element = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();
    const instance = viewer();

    expect(csvFetches()).toEqual([csvUrl("AF-P05067-F1")]);
    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME]);
    // pdbe-molstar colours by pLDDT when it loads the model.
    expect(themedAfterLoad(instance)).toBe(true);
    // The mean of each residue's substitutions.
    expect(await coloured(instance)).toEqual([
      [0, 0.3],
      [1, 0.9],
    ]);
    expect(element.message).toBeNull();
  });

  test.each([
    ["unset", {}],
    ["alphafold", { "color-theme": "alphafold" }],
    ["unknown", { "color-theme": "rainbow" }],
  ])(
    "%s keeps pdbe-molstar's pLDDT colouring and fetches nothing",
    async (_, attributes) => {
      serve([prediction("AF-P05067-F1")], {
        [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
      });
      element = mount({ ...AF, ...attributes });
      await settle();

      expect(viewer().visual.update).toHaveBeenCalledTimes(1);
      expect(themes(viewer())).toEqual([]);
      expect(csvFetches()).toEqual([]);
    },
  );

  test("switching color-theme re-colours the model without reloading it", async () => {
    serve([prediction("AF-P05067-F1")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
    });
    element = mount({ ...AF, "color-theme": "alphafold" });
    await settle();
    const instance = viewer();

    element.setAttribute("color-theme", "alphamissense");
    await settle();
    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME]);

    element.setAttribute("color-theme", "alphafold");
    await settle();
    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME, "plddt-confidence"]);

    element.setAttribute("color-theme", "alphamissense");
    await settle();
    expect(themes(instance)).toEqual([
      ALPHAMISSENSE_THEME,
      "plddt-confidence",
      ALPHAMISSENSE_THEME,
    ]);
    expect(instance.visual.update).toHaveBeenCalledTimes(1);
    // Fetched once.
    expect(csvFetches()).toEqual([csvUrl("AF-P05067-F1")]);
  });

  test("alphamissense is re-applied after each reload, with the new model's file", async () => {
    serve([prediction("AF-P05067-F1"), prediction("AF-P05067-F2")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
      [csvUrl("AF-P05067-F2")]: csv(0.6, 0.1),
    });
    element = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();
    const instance = viewer();

    element.setAttribute("structure-id", "AF-P05067-F2");
    await settle();
    expect(instance.visual.update).toHaveBeenCalledTimes(2);
    expect(themes(instance)).toEqual([
      ALPHAMISSENSE_THEME,
      ALPHAMISSENSE_THEME,
    ]);
    expect(themedAfterLoad(instance)).toBe(true);
    expect(await coloured(instance)).toEqual([
      [0, 0.6],
      [1, 0.1],
    ]);

    element.setAttribute("structure-id", "AF-P05067-F1");
    await settle();
    expect(themes(instance)).toHaveLength(3);
    expect(themedAfterLoad(instance)).toBe(true);
    // Each file was fetched once.
    expect(csvFetches()).toEqual([
      csvUrl("AF-P05067-F1"),
      csvUrl("AF-P05067-F2"),
    ]);
  });

  test("the file is fetched only once its AlphaFold model has loaded", async () => {
    serve([prediction("AF-P05067-F1"), prediction("AF-P05067-F2")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
      [csvUrl("AF-P05067-F2")]: csv(0.6, 0.1),
    });
    element = mount({ ...AF, "color-theme": "alphafold" });
    await settle();
    const instance = viewer();
    let completeLoad: (loaded: boolean) => void = () => undefined;
    instance.visual.update.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          completeLoad = resolve;
        }),
    );

    element.setAttribute("structure-id", "AF-P05067-F2");
    element.setAttribute("color-theme", "alphamissense");
    await settle();
    // Not F1's, on screen meanwhile, nor F2's yet.
    expect(csvFetches()).toEqual([]);
    expect(themes(instance)).toEqual([]);

    completeLoad(true);
    await settle();
    expect(csvFetches()).toEqual([csvUrl("AF-P05067-F2")]);
    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME]);
  });

  test("a model without AlphaMissense data keeps pLDDT colouring and says so", async () => {
    serve([prediction("AF-P05067-F1", { amAnnotationsUrl: undefined })]);
    element = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();

    expect(themes(viewer())).toEqual([]);
    expect(csvFetches()).toEqual([]);
    expect(element.message).toEqual({
      title: "Error",
      content: 'No AlphaMissense data for "AF-P05067-F1"',
    });
  });

  test.each([
    ["can't be fetched", new Error("Failed to fetch")],
    ["is missing", undefined],
    // Even if the error's body would parse.
    ["is answered with an HTTP error", { status: 503, body: csv(0.3, 0.9) }],
    ["is not an AlphaMissense file", "<html>Maintenance</html>"],
  ])(
    "when the file %s, the model keeps pLDDT colouring and says so",
    async (_, file) => {
      serve(
        [prediction("AF-P05067-F1")],
        file === undefined ? {} : { [csvUrl("AF-P05067-F1")]: file },
      );
      element = mount({ ...AF, "color-theme": "alphamissense" });
      await settle();
      const instance = viewer();

      expect(themes(instance)).toEqual([]);
      expect(element.message).toEqual({
        title: "Error",
        content: `Couldn't load AlphaMissense data for "AF-P05067-F1"`,
      });

      // The error goes with the theme.
      element.setAttribute("color-theme", "alphafold");
      await settle();
      expect(element.message).toBeNull();
      expect(themes(instance)).toEqual(["plddt-confidence"]);
    },
  );

  test("a file that failed to load is fetched again the next time it is needed", async () => {
    const files: Record<string, File> = {
      [csvUrl("AF-P05067-F1")]: new Error("Failed to fetch"),
    };
    serve([prediction("AF-P05067-F1")], files);
    element = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();
    const instance = viewer();
    expect(themes(instance)).toEqual([]);

    files[csvUrl("AF-P05067-F1")] = csv(0.3, 0.9);
    element.setAttribute("color-theme", "alphafold");
    await settle();
    element.setAttribute("color-theme", "alphamissense");
    await settle();

    expect(csvFetches()).toEqual([
      csvUrl("AF-P05067-F1"),
      csvUrl("AF-P05067-F1"),
    ]);
    expect(themes(instance)).toEqual(["plddt-confidence", ALPHAMISSENSE_THEME]);
    expect(element.message).toBeNull();
  });

  test.each([
    ["fails", new Error("Failed to fetch")],
    ["succeeds", csv(0.3, 0.9)],
  ])(
    "a file that arrives after its model was replaced is ignored when it %s",
    async (_, late) => {
      const f1 = deferredFile();
      serve([prediction("AF-P05067-F1"), prediction("AF-P05067-F2")], {
        [csvUrl("AF-P05067-F1")]: f1.file,
        [csvUrl("AF-P05067-F2")]: csv(0.6, 0.1),
      });
      element = mount({ ...AF, "color-theme": "alphamissense" });
      await settle();
      const instance = viewer();
      expect(csvFetches()).toEqual([csvUrl("AF-P05067-F1")]);

      element.setAttribute("structure-id", "AF-P05067-F2");
      await settle();
      f1.answer(late);
      await settle();

      expect(element.message).toBeNull();
      expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME]);
      expect(await coloured(instance)).toEqual([
        [0, 0.6],
        [1, 0.1],
      ]);
    },
  );

  test("switching back before the file arrives keeps pLDDT colouring", async () => {
    const f1 = deferredFile();
    serve([prediction("AF-P05067-F1")], {
      [csvUrl("AF-P05067-F1")]: f1.file,
    });
    element = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();
    const instance = viewer();

    element.setAttribute("color-theme", "alphafold");
    await settle();
    f1.answer(csv(0.3, 0.9));
    await settle();

    expect(themes(instance)).toEqual(["plddt-confidence"]);
  });

  test.each([
    ["a PDB id", { "structure-id": "1AAP" }],
    ["a model-url", { "model-url": "https://example.org/model.cif" }],
  ])("is ignored for %s", async (_, attributes) => {
    serve([]);
    element = mount({
      "protein-accession": "P05067",
      "color-theme": "alphamissense",
      ...attributes,
    });
    await settle();
    element.setAttribute("color-theme", "alphafold");
    await settle();
    element.setAttribute("color-theme", "alphamissense");
    await settle();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(themes(viewer())).toEqual([]);
    expect(element.message).toBeNull();
  });

  test("AlphaFold models are coloured by pLDDT confidence after other structures, and only they are", async () => {
    serve([prediction("AF-P05067-F1")]);
    element = mount({ "protein-accession": "P05067", "structure-id": "1AAP" });
    await settle();
    const instance = viewer();
    // Whether each load was set up to colour by pLDDT confidence, as
    // pdbe-molstar sets up a viewer created for an AlphaFold model.
    const plddt: boolean[] = [];
    instance.visual.update.mockImplementation(async () => {
      const preset = instance.plugin.config.get(
        PluginConfig.Structure.DefaultRepresentationPresetParams,
      );
      plddt.push(preset.theme.globalName === "plddt-confidence");
      return true;
    });

    element.setAttribute("structure-id", "AF-P05067-F1");
    await settle();
    // Its colour theme and hover label.
    expect(
      instance.plugin.state.behaviors.cells.has(MAQualityAssessment.id),
    ).toBe(true);
    element.setAttribute("structure-id", "1AAP");
    await settle();
    element.setAttribute("structure-id", "AF-P05067-F1");
    await settle();

    expect(plddt).toEqual([true, false, true]);
    // The preset's other settings are pdbe-molstar's.
    expect(
      instance.plugin.config.get(
        PluginConfig.Structure.DefaultRepresentationPresetParams,
      ).theme.carbonColor,
    ).toEqual({ name: "element-symbol", params: {} });
  });

  test("a highlight keeps the AlphaMissense colours, and re-colouring keeps the highlight", async () => {
    serve([prediction("AF-P05067-F1")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
    });
    element = mount({
      ...AF,
      "color-theme": "alphamissense",
      highlight: "1:2",
    });
    await settle();
    const instance = viewer();

    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME]);
    // Not overpainted: the range is shown by dimming the rest.
    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        {
          beg_auth_seq_id: 1,
          end_auth_seq_id: 2,
          color: null,
          opacity: 1,
          focus: true,
        },
      ],
      nonSelectedOpacity: 0.3,
    });

    element.setAttribute("color-theme", "alphafold");
    await settle();
    expect(themes(instance)).toEqual([ALPHAMISSENSE_THEME, "plddt-confidence"]);
    // The selection is left in place.
    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(1);
  });

  test("every viewer registers the theme on its own plugin", async () => {
    serve([prediction("AF-P05067-F1")], {
      [csvUrl("AF-P05067-F1")]: csv(0.3, 0.9),
    });
    element = mount({ ...AF, "color-theme": "alphamissense" });
    const other = mount({ ...AF, "color-theme": "alphamissense" });
    await settle();
    // Re-appended: a new viewer.
    document.documentElement.removeChild(element);
    document.documentElement.appendChild(element);
    await settle();
    document.documentElement.removeChild(other);

    expect(PDBeMolstarPlugin.instances).toHaveLength(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PDBeMolstarPlugin.instances.forEach(({ plugin }: any) => {
      const { colorThemeRegistry } = plugin.representation.structure.themes;
      expect(colorThemeRegistry.add).toHaveBeenCalledTimes(1);
      expect(colorThemeRegistry.add.mock.calls[0][0].name).toBe(
        ALPHAMISSENSE_THEME,
      );
      expect(plugin.customModelProperties.register).toHaveBeenCalledTimes(1);
      expect(plugin.managers.lociLabels.addProvider).toHaveBeenCalledTimes(1);
    });
    // The re-appended element's viewer is coloured too.
    expect(themes(PDBeMolstarPlugin.instances[2])).toEqual([
      ALPHAMISSENSE_THEME,
    ]);
  });
});
