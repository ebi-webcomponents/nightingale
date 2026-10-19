// Under jest's transpile-only ts-jest the CJS dompurify's default import is
// undefined, so render() would throw whenever a message is shown while
// structure-id is set. Production builds use the ESM bundle.
jest.mock("dompurify", () => ({
  __esModule: true,
  default: { sanitize: (s: string) => s },
}));

import NightingaleStructure from "../src/index";
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

/** The params the only viewer's structure was first loaded with. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialLoad = (): any => viewer().visual.update.mock.calls[0][0];

describe("nightingale-structure source resolution", () => {
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

  describe("model-url's format is inferred from its extension", () => {
    test.each([
      ["https://example.org/model.cif", "cif", false],
      ["https://example.org/model.bcif", "cif", true],
      // The query string is not part of the extension.
      ["https://example.org/MODEL.BCIF?version=2", "cif", true],
      ["https://example.org/model.pdb", "pdb", false],
      ["https://example.org/model.pdb?download=1", "pdb", false],
      ["https://example.org/pdb1aap.ent", "pdb", false],
    ])("%s", async (url, format, binary) => {
      element = mount({ "model-url": url });
      await settle();

      expect(initialLoad().customData).toEqual({ url, format, binary });
      expect(initialLoad().moleculeId).toBeUndefined();
    });
  });

  test("custom-download-url loads the lowercased id's cif from there", async () => {
    element = mount({
      "structure-id": "1AAP",
      "custom-download-url": "https://example.org/pdb/",
    });
    await settle();

    expect(initialLoad().customData).toEqual({
      url: "https://example.org/pdb/1aap.cif",
      format: "cif",
      binary: false,
    });
    expect(initialLoad().moleculeId).toBeUndefined();
  });

  test("an AlphaFold id loads the prediction whose modelEntityId it is", async () => {
    const prediction = (id: string) => ({
      modelEntityId: id,
      chainId: "A",
      uniprotAccession: "P05067",
      cifUrl: `https://example.org/${id}.cif`,
    });
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        prediction("AF-P05067-F1"),
        prediction("AF-P05067-F2"),
      ],
    });
    element = mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F2",
    });
    await settle();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://alphafold.ebi.ac.uk/api/prediction/P05067",
    );
    expect(initialLoad().customData).toEqual({
      url: "https://example.org/AF-P05067-F2.cif",
      format: "cif",
      binary: false,
    });
    expect(initialLoad().alphafoldView).toBe(true);
  });

  test.each([
    [
      "its BinaryCIF file when it has one",
      {
        bcifUrl: "https://example.org/AF-P05067-F1.bcif",
        cifUrl: "https://example.org/AF-P05067-F1.cif",
      },
      {
        url: "https://example.org/AF-P05067-F1.bcif",
        format: "cif",
        binary: true,
      },
    ],
    [
      "its mmCIF file otherwise",
      { cifUrl: "https://example.org/AF-P05067-F1.cif" },
      {
        url: "https://example.org/AF-P05067-F1.cif",
        format: "cif",
        binary: false,
      },
    ],
  ])("an AlphaFold model loads from %s", async (_, urls, customData) => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        { modelEntityId: "AF-P05067-F1", chainId: "A", ...urls },
      ],
    });
    element = mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F1",
    });
    await settle();

    expect(initialLoad().customData).toEqual(customData);
  });

  test.each([
    ["first", {}, 0],
    ["after another structure", { "structure-id": "1AAP" }, 1],
  ])(
    "an AlphaFold model without a model file is reported, %s",
    async (_, initial, loads) => {
      global.fetch = jest.fn().mockResolvedValue({
        json: async () => [{ modelEntityId: "AF-P05067-F1", chainId: "A" }],
      });
      element = mount({ "protein-accession": "P05067", ...initial });
      await settle();
      element.setAttribute("structure-id", "AF-P05067-F1");
      await settle();

      expect(element.message).toEqual({
        title: "Error",
        content: 'No model file for AF entry "AF-P05067-F1"',
      });
      // Nothing loaded for it.
      expect(
        PDBeMolstarPlugin.instances.flatMap(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (instance: any) => instance.visual.update.mock.calls,
        ),
      ).toHaveLength(loads);
    },
  );

  describe("changing the source reloads the viewer", () => {
    test.each([
      [
        "structure-id",
        { "structure-id": "1AAP" },
        "2XYZ",
        { moleculeId: "2xyz" },
      ],
      [
        "model-url",
        { "model-url": "https://example.org/a.cif" },
        "https://example.org/b.bcif",
        {
          customData: {
            url: "https://example.org/b.bcif",
            format: "cif",
            binary: true,
          },
        },
      ],
      [
        "custom-download-url",
        {
          "structure-id": "1AAP",
          "custom-download-url": "https://example.org/a/",
        },
        "https://example.org/b/",
        {
          customData: {
            url: "https://example.org/b/1aap.cif",
            format: "cif",
            binary: false,
          },
        },
      ],
    ])("%s", async (name, attributes, value, loaded) => {
      element = mount(attributes);
      await settle();
      const instance = viewer();
      expect(instance.visual.update).toHaveBeenCalledTimes(1);

      element.setAttribute(name, value);
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(instance.visual.update).toHaveBeenCalledTimes(2);
      expect(instance.visual.update).toHaveBeenLastCalledWith(
        expect.objectContaining(loaded),
        true,
      );
    });
  });

  describe("highlight-color", () => {
    test("is passed to pdbe-molstar without its alpha channel", async () => {
      element = mount({
        "structure-id": "1AAP",
        "highlight-color": "#FFEB3B66",
      });
      await settle();
      const instance = viewer();
      expect(instance.initParams).toEqual(
        expect.objectContaining({
          highlightColor: "#FFEB3B",
          selectColor: "#FFEB3B",
        }),
      );

      element.setAttribute("highlight-color", "FF000080");
      await settle();
      expect(instance.visual.setColor).toHaveBeenCalledWith({
        highlight: "#FF0000",
        select: "#FF0000",
      });
    });
  });
});
