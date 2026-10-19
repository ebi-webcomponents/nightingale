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

/** Let the lit update cycle and the viewer's async init settle. */
const settle = async () => {
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
};

/** Fire a residue click the way pdbe-molstar's `CustomEvents.add` does. */
const click = (container: Element, eventData: Record<string, unknown>) => {
  const event = new MouseEvent("PDB.molstar.click", { bubbles: true });
  (event as unknown as { eventData: unknown }).eventData = eventData;
  container.dispatchEvent(event);
};

describe("nightingale-structure tests", () => {
  let rendered: NightingaleStructure;

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
    rendered = new NightingaleStructure();
    rendered.setAttribute("protein-accession", "P05067");
    rendered.setAttribute("structure-id", "1AAP");
    document.documentElement.appendChild(rendered);
  });

  afterEach(() => {
    if (rendered.isConnected) document.documentElement.removeChild(rendered);
  });

  test("it registers and renders the <nightingale-structure> element", () => {
    const element = document.querySelector("nightingale-structure");
    expect(element).not.toBeNull();
    expect(element instanceof NightingaleStructure).toBe(true);
  });

  test("it mounts a pdbe-molstar viewer into its own render root", async () => {
    await settle();

    expect(PDBeMolstarPlugin.instances).toHaveLength(1);
    const [instance] = PDBeMolstarPlugin.instances;
    expect(instance.render).toHaveBeenCalledTimes(1);

    // The viewer must be rendered inside the component's own container, not
    // the document.
    const container = rendered.renderRoot.querySelector("#molstar-parent");
    expect(container).not.toBeNull();
    expect(instance.container.parentElement).toBe(container);
  });

  test("it loads a plain PDB id as a moleculeId rather than a custom URL", async () => {
    await settle();

    const [instance] = PDBeMolstarPlugin.instances;
    const [[loaded]] = instance.visual.update.mock.calls;
    expect(loaded.moleculeId).toBe("1aap");
    expect(loaded.customData).toBeUndefined();
    expect(loaded.alphafoldView).toBe(false);
  });

  test("it renders an empty viewer and loads the structure into it", async () => {
    await settle();

    // Given a structure, pdbe-molstar's render() starts loading it without
    // awaiting or catching the load, so a failed first load would be an
    // unhandled rejection inside pdbe-molstar. visual.update is awaited.
    const [instance] = PDBeMolstarPlugin.instances;
    expect(instance.initParams.moleculeId).toBeUndefined();
    expect(instance.initParams.customData).toBeUndefined();
    expect(instance.visual.update).toHaveBeenCalledTimes(1);
    expect(instance.visual.update).toHaveBeenCalledWith(
      expect.objectContaining({ moleculeId: "1aap" }),
      true,
    );
  });

  test("it turns off pdbe-molstar's subscribeEvents", async () => {
    await settle();

    // subscribeEvents adds document listeners that pdbe-molstar never removes.
    // Clicks don't need it: pdbe-molstar always emits PDB.molstar.click on the
    // container (see "clicking a residue").
    const [instance] = PDBeMolstarPlugin.instances;
    expect(instance.initParams.subscribeEvents).toBe(false);
  });

  describe("clicking a residue", () => {
    let changes: string[];

    beforeEach(async () => {
      await settle();
      changes = [];
      rendered.addEventListener("change", (e) =>
        changes.push((e as CustomEvent).detail.highlight),
      );
    });

    test("of protein-accession emits its UniProt position", () => {
      const [instance] = PDBeMolstarPlugin.instances;
      click(instance.container, {
        entry_id: "1aap",
        auth_asym_id: "A",
        label_asym_id: "A",
        unp_accession: "P05067",
        unp_seq_id: 296,
        seq_id: 5,
        auth_seq_id: 5,
      });

      expect(changes).toEqual(["296:296"]);
      expect(rendered.highlight).toBe("296:296");
    });

    test("of a chain of another accession emits nothing", () => {
      const [instance] = PDBeMolstarPlugin.instances;
      rendered.highlight = "10:20";
      click(instance.container, {
        entry_id: "1aap",
        auth_asym_id: "B",
        label_asym_id: "B",
        unp_accession: "P99999",
        unp_seq_id: 50,
        seq_id: 50,
        auth_seq_id: 50,
      });

      expect(changes).toEqual([]);
      expect(rendered.highlight).toBe("10:20");
      expect(rendered.message?.title).toBe("Error");
    });

    test("of a model-url structure shows a tooltip titled with the URL", async () => {
      rendered.removeAttribute("structure-id");
      rendered.setAttribute("model-url", "https://example.org/model.cif");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      click(instance.container, { auth_asym_id: "A", auth_seq_id: 42 });
      await rendered.updateComplete;

      const overlay = rendered.querySelector(".structure-viewer-messages");
      expect(overlay?.querySelector("span")?.textContent).toBe(
        "https://example.org/model.cif",
      );
      expect(overlay?.textContent).toContain("P05067: 42");
    });
  });

  test("it disposes the viewer when disconnected", async () => {
    await settle();

    const [instance] = PDBeMolstarPlugin.instances;
    document.documentElement.removeChild(rendered);

    expect(instance.plugin.dispose).toHaveBeenCalledTimes(1);
  });
});

describe("entry-chain emphasis", () => {
  let rendered: NightingaleStructure;

  const mount = async (attributes: Record<string, string>) => {
    rendered = new NightingaleStructure();
    for (const [name, value] of Object.entries(attributes)) {
      rendered.setAttribute(name, value);
    }
    document.documentElement.appendChild(rendered);
    await settle();
    return PDBeMolstarPlugin.instances[0];
  };

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
  });

  afterEach(() => {
    if (rendered?.isConnected) document.documentElement.removeChild(rendered);
    PDBeMolstarPlugin.matches = PDBeMolstarPlugin.defaultMatches;
  });

  test("it emphasizes the entry's chains on the default load", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.select).toHaveBeenCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, opacity: 1, focus: true },
      ],
      nonSelectedOpacity: 0.3,
    });
  });

  test("hide-entry-emphasis opts out without touching the camera", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "hide-entry-emphasis": "",
    });

    expect(instance.visual.select).not.toHaveBeenCalled();
    expect(instance.visual.reset).not.toHaveBeenCalled();
  });

  test("it applies no emphasis to AlphaFold structures", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => [
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
        },
      ],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = fetchMock;

    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F1",
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(instance.visual.update.mock.calls[0][0].customData?.url).toBe(
      "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
    );
    expect(instance.visual.select).not.toHaveBeenCalled();
  });

  test("an AlphaFold highlight keeps pLDDT colours and dims the rest", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: async () => [
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
        },
      ],
    });
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F1",
    });

    rendered.setAttribute("highlight", "290:315");
    await settle();

    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        {
          beg_auth_seq_id: 290,
          end_auth_seq_id: 315,
          color: null,
          opacity: 1,
          focus: true,
        },
      ],
      nonSelectedOpacity: 0.3,
    });
  });

  test("entry-chains enables the emphasis for model-url loads", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "model-url": "https://example.com/model.cif",
      "entry-chains": "A, B",
    });

    expect(instance.visual.select).toHaveBeenCalledWith({
      data: [
        { auth_asym_id: "A", color: null, opacity: 1, focus: true },
        { auth_asym_id: "B", color: null, opacity: 1, focus: true },
      ],
      nonSelectedOpacity: 0.3,
    });
  });

  test("entry-chains takes precedence over the SIFTS accession lookup", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "6IYC",
      "entry-chains": "E",
    });

    expect(instance.visual.select).toHaveBeenCalledWith({
      data: [{ auth_asym_id: "E", color: null, opacity: 1, focus: true }],
      nonSelectedOpacity: 0.3,
    });
  });

  test("it applies no emphasis without an accession or for model-url loads", async () => {
    const noAccession = await mount({ "structure-id": "1AAP" });
    expect(noAccession.visual.select).not.toHaveBeenCalled();
    document.documentElement.removeChild(rendered);

    PDBeMolstarPlugin.instances.length = 0;
    const modelUrl = await mount({
      "protein-accession": "P05067",
      "model-url": "https://example.com/model.cif",
    });
    expect(modelUrl.visual.select).not.toHaveBeenCalled();
  });

  test("it applies no emphasis to an archive file without SIFTS", async () => {
    const archive = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "custom-download-url": "https://example.org/pdb/",
    });

    // Its uniprot_accession query would match nothing, and pdbe-molstar
    // would still dim the whole structure, emphasizing nothing.
    expect(archive.visual.update.mock.calls[0][0].customData?.url).toBe(
      "https://example.org/pdb/1aap.cif",
    );
    expect(archive.visual.select).not.toHaveBeenCalled();
    expect(archive.visual.reset).not.toHaveBeenCalled();
    document.documentElement.removeChild(rendered);

    // Not a regression test: entry-chains needs no SIFTS.
    PDBeMolstarPlugin.instances.length = 0;
    const withChains = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "custom-download-url": "https://example.org/pdb/",
      "entry-chains": "A",
    });
    expect(withChains.visual.select).toHaveBeenCalledWith({
      data: [{ auth_asym_id: "A", color: null, opacity: 1, focus: true }],
      nonSelectedOpacity: 0.3,
    });
  });

  test("a highlight merges with the emphasis into a single select call", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    rendered.setAttribute("highlight", "290:315");
    await settle();

    // The dimming the load applied is kept (see "keeping the dimming").
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, focus: false },
        {
          uniprot_accession: "P05067",
          start_uniprot_residue_number: 290,
          end_uniprot_residue_number: 315,
          color: "#FFEB3B",
          focus: true,
        },
      ],
      keepOpacity: true,
    });
  });

  test("clearing the highlight restores the entry emphasis without a camera reset", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    rendered.setAttribute("highlight", "290:315");
    await settle();

    rendered.removeAttribute("highlight");
    await settle();

    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [{ uniprot_accession: "P05067", color: null, focus: true }],
      keepOpacity: true,
    });
    expect(instance.visual.reset).not.toHaveBeenCalled();
  });

  test("changing highlight-color re-applies the merged selection", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    rendered.setAttribute("highlight", "290:315");
    await settle();

    rendered.setAttribute("highlight-color", "#FF0000");
    await settle();

    expect(instance.visual.setColor).toHaveBeenCalledWith({
      highlight: "#FF0000",
      select: "#FF0000",
    });
    // Leaving the camera where the user may have moved it.
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, focus: false },
        {
          uniprot_accession: "P05067",
          start_uniprot_residue_number: 290,
          end_uniprot_residue_number: 315,
          color: "#FF0000",
          focus: false,
        },
      ],
      keepOpacity: true,
    });
  });

  test("entry-emphasis-opacity controls the dimming of other chains", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "entry-emphasis-opacity": "0.15",
    });

    expect(instance.visual.select).toHaveBeenCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, opacity: 1, focus: true },
      ],
      nonSelectedOpacity: 0.15,
    });
  });

  test("an unset entry-emphasis-opacity dims to the default", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "entry-emphasis-opacity": "0.5",
    });
    const lastOpacity = () =>
      instance.visual.select.mock.calls.at(-1)[0].nonSelectedOpacity;
    expect(lastOpacity()).toBe(0.5);

    // Removed, e.g. by lit's `ifDefined(undefined)`: Lit's Number converter
    // would set null, which pdbe-molstar applied as opacity 0, hiding
    // everything outside the entry.
    rendered.removeAttribute("entry-emphasis-opacity");
    await settle();
    expect(rendered["entry-emphasis-opacity"]).toBe(0.3);
    expect(lastOpacity()).toBe(0.3);

    rendered.setAttribute("entry-emphasis-opacity", "0.5");
    await settle();
    rendered.setAttribute("entry-emphasis-opacity", "");
    await settle();
    expect(lastOpacity()).toBe(0.3);

    // Set as a property by a framework binding.
    for (const value of [null, undefined, Number.NaN]) {
      rendered["entry-emphasis-opacity"] = 0.5;
      // eslint-disable-next-line no-await-in-loop
      await settle();
      rendered["entry-emphasis-opacity"] = value as unknown as number;
      // eslint-disable-next-line no-await-in-loop
      await settle();
      expect(lastOpacity()).toBe(0.3);
    }

    rendered.setAttribute("entry-emphasis-opacity", "1.5");
    await settle();
    expect(lastOpacity()).toBe(1);
  });

  test("an entry-emphasis-opacity set as a numeric string property is used", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    const lastOpacity = () =>
      instance.visual.select.mock.calls.at(-1)[0].nonSelectedOpacity;

    // As a framework binding may set it.
    rendered["entry-emphasis-opacity"] = "0.5" as unknown as number;
    await settle();
    expect(lastOpacity()).toBe(0.5);

    for (const value of [" ", "not a number"]) {
      rendered["entry-emphasis-opacity"] = 0.5;
      // eslint-disable-next-line no-await-in-loop
      await settle();
      rendered["entry-emphasis-opacity"] = value as unknown as number;
      // eslint-disable-next-line no-await-in-loop
      await settle();
      expect(lastOpacity()).toBe(0.3);
    }
  });

  test("it applies no emphasis when the entry matches nothing in the structure", async () => {
    PDBeMolstarPlugin.matches = (params: Record<string, unknown>[]) =>
      params.every(
        (param) =>
          param.uniprot_accession !== "P99999" && param.auth_asym_id !== "Z",
      );
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    expect(instance.visual.select).toHaveBeenCalledTimes(1);

    // pdbe-molstar would drop the item but still dim the whole structure.
    rendered.setAttribute("protein-accession", "P99999");
    await settle();
    expect(instance.visual.update).toHaveBeenCalledTimes(1); // the initial load
    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(2);
    expect(instance.visual.reset).not.toHaveBeenCalled();

    // A highlight is still applied, without the dimming.
    rendered.setAttribute("highlight", "10:20");
    await settle();
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        {
          uniprot_accession: "P99999",
          start_uniprot_residue_number: 10,
          end_uniprot_residue_number: 20,
          color: "#FFEB3B",
          focus: true,
        },
      ],
      nonSelectedOpacity: undefined,
    });
    document.documentElement.removeChild(rendered);

    PDBeMolstarPlugin.instances.length = 0;
    const absentChains = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "entry-chains": "Z",
    });
    expect(absentChains.visual.select).not.toHaveBeenCalled();
    expect(absentChains.visual.reset).not.toHaveBeenCalled();
  });

  test.each(["", " , "])(
    "entry-chains %j falls back to the SIFTS accession lookup",
    async (chains) => {
      const instance = await mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        "entry-chains": chains,
      });

      expect(instance.visual.select).toHaveBeenCalledTimes(1);
      expect(instance.visual.select).toHaveBeenCalledWith({
        data: [
          { uniprot_accession: "P05067", color: null, opacity: 1, focus: true },
        ],
        nonSelectedOpacity: 0.3,
      });
    },
  );

  test("hide-entry-emphasis leaves the rest undimmed around a highlight", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      "hide-entry-emphasis": "",
      highlight: "290:315",
    });

    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.select).toHaveBeenCalledWith({
      data: [
        {
          uniprot_accession: "P05067",
          start_uniprot_residue_number: 290,
          end_uniprot_residue_number: 315,
          color: "#FFEB3B",
          focus: true,
        },
      ],
      nonSelectedOpacity: undefined,
    });
  });

  test("changing the emphasis attributes after the load re-applies it", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    rendered.setAttribute("entry-emphasis-opacity", "0.15");
    await settle();
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, opacity: 1, focus: true },
      ],
      nonSelectedOpacity: 0.15,
    });

    rendered.setAttribute("entry-chains", "A");
    await settle();
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [{ auth_asym_id: "A", color: null, opacity: 1, focus: true }],
      nonSelectedOpacity: 0.15,
    });

    // With no highlight, nothing is left to select: the dimming is cleared
    // and the camera frames the whole structure again.
    rendered.setAttribute("hide-entry-emphasis", "");
    await settle();
    expect(instance.visual.select).toHaveBeenCalledTimes(3);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(4);
    expect(instance.visual.reset).toHaveBeenCalledWith({ camera: true });
  });

  test("removing an AlphaFold highlight clears its dimming", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: async () => [
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
        },
      ],
    });
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F1",
      highlight: "290:315",
    });
    expect(instance.visual.select).toHaveBeenCalledTimes(1);

    rendered.removeAttribute("highlight");
    await settle();

    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(2);
    expect(instance.visual.reset).toHaveBeenCalledWith({ camera: true });
  });

  test("removing protein-accession clears the emphasis without a camera reset", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    // The SIFTS lookup needs it; the PDB entry stays loaded.
    rendered.removeAttribute("protein-accession");
    await settle();

    expect(instance.visual.update).toHaveBeenCalledTimes(1); // the initial load
    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(2);
    expect(instance.visual.reset).not.toHaveBeenCalled();
  });

  test("a reload emphasizes the new structure's entry chains", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    rendered.setAttribute("structure-id", "6IYC");
    await settle();

    expect(instance.visual.update).toHaveBeenCalledTimes(2);
    expect(instance.visual.select).toHaveBeenCalledTimes(2);
    expect(instance.visual.select).toHaveBeenLastCalledWith({
      data: [
        { uniprot_accession: "P05067", color: null, opacity: 1, focus: true },
      ],
      nonSelectedOpacity: 0.3,
    });
  });

  test("a reload from an emphasized entry to an AlphaFold model keeps the model's framing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      json: async () => [
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
        },
      ],
    });
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });

    rendered.setAttribute("structure-id", "AF-P05067-F1");
    // The lookup and the load, then any selection queued after them.
    await settle();
    await settle();

    // The load replaced the emphasized structure, and framed the new one.
    expect(instance.visual.update).toHaveBeenCalledTimes(2);
    expect(instance.visual.update.mock.calls[1][0].customData.url).toBe(
      "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
    );
    expect(instance.visual.select).toHaveBeenCalledTimes(1);
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(1);
    expect(instance.visual.reset).not.toHaveBeenCalled();
  });
});

describe("keeping the dimming", () => {
  let rendered: NightingaleStructure;

  const mount = async (attributes: Record<string, string>) => {
    rendered = new NightingaleStructure();
    for (const [name, value] of Object.entries(attributes)) {
      rendered.setAttribute(name, value);
    }
    document.documentElement.appendChild(rendered);
    await settle();
    return PDBeMolstarPlugin.instances[0];
  };

  const set = async (name: string, value: string | null) => {
    if (value === null) rendered.removeAttribute(name);
    else rendered.setAttribute(name, value);
    await settle();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lastCall = (fn: any) => fn.mock.calls[fn.mock.calls.length - 1];

  /** The selection of P05067's chains, dimming the rest to `opacity`. */
  const rebuilt = (range: [number, number], opacity = 0.3) => ({
    data: [
      { uniprot_accession: "P05067", color: null, opacity: 1, focus: false },
      {
        uniprot_accession: "P05067",
        start_uniprot_residue_number: range[0],
        end_uniprot_residue_number: range[1],
        color: "#FFEB3B",
        focus: true,
      },
    ],
    nonSelectedOpacity: opacity,
  });

  const prediction = {
    modelEntityId: "AF-P05067-F1",
    chainId: "A",
    cifUrl: "https://alphafold.ebi.ac.uk/files/AF-P05067-F1.cif",
  };

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
  });

  afterEach(() => {
    if (rendered?.isConnected) document.documentElement.removeChild(rendered);
  });

  test("a highlight change neither rebuilds nor adds to the dimming", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    expect(lastCall(instance.visual.clearSelection)).toEqual([
      undefined,
      undefined,
    ]);

    await set("highlight", "290:315");
    await set("highlight", "300:310");

    // Rebuilding it is O(atoms). With `keepOpacity`, pdbe-molstar would add
    // any opacity or nonSelectedOpacity to the kept layers.
    expect(lastCall(instance.visual.clearSelection)).toEqual([
      undefined,
      { keepOpacity: true },
    ]);
    expect(lastCall(instance.visual.select)).toEqual([
      {
        data: [
          { uniprot_accession: "P05067", color: null, focus: false },
          {
            uniprot_accession: "P05067",
            start_uniprot_residue_number: 300,
            end_uniprot_residue_number: 310,
            color: "#FFEB3B",
            focus: true,
          },
        ],
        keepOpacity: true,
      },
    ]);
  });

  test("an emphasis change rebuilds the dimming", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      highlight: "290:315",
    });

    await set("entry-emphasis-opacity", "0.15");
    expect(lastCall(instance.visual.clearSelection)).toEqual([
      undefined,
      undefined,
    ]);
    expect(lastCall(instance.visual.select)).toEqual([
      rebuilt([290, 315], 0.15),
    ]);

    await set("hide-entry-emphasis", "");
    expect(lastCall(instance.visual.clearSelection)).toEqual([
      undefined,
      undefined,
    ]);
    expect(lastCall(instance.visual.select)[0].nonSelectedOpacity).toBe(
      undefined,
    );

    await set("hide-entry-emphasis", null);
    await set("entry-chains", "A");
    expect(lastCall(instance.visual.select)).toEqual([
      {
        data: [
          { auth_asym_id: "A", color: null, opacity: 1, focus: false },
          {
            uniprot_accession: "P05067",
            start_uniprot_residue_number: 290,
            end_uniprot_residue_number: 315,
            color: "#FFEB3B",
            focus: true,
          },
        ],
        nonSelectedOpacity: 0.15,
      },
    ]);
  });

  test("a reload rebuilds the dimming", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
      highlight: "290:315",
    });

    await set("structure-id", "6IYC");

    expect(instance.visual.update).toHaveBeenCalledTimes(2);
    expect(lastCall(instance.visual.select)).toEqual([rebuilt([290, 315])]);
  });

  test("a failed selection is followed by a rebuild", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    instance.visual.select.mockRejectedValueOnce(new Error("busy"));
    await set("highlight", "290:315");

    // It may have dimmed the structure, or not.
    await set("highlight", "300:310");
    expect(lastCall(instance.visual.select)).toEqual([rebuilt([300, 310])]);
  });

  test("on AlphaFold models, a highlight change rebuilds it", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = jest
      .fn()
      .mockResolvedValue({ json: async () => [prediction] });
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "AF-P05067-F1",
      highlight: "10:20",
    });

    await set("highlight", "30:40");

    // There, the dimming is the highlight.
    expect(lastCall(instance.visual.clearSelection)).toEqual([
      undefined,
      undefined,
    ]);
    expect(lastCall(instance.visual.select)).toEqual([
      {
        data: [
          {
            beg_auth_seq_id: 30,
            end_auth_seq_id: 40,
            color: null,
            opacity: 1,
            focus: true,
          },
        ],
        nonSelectedOpacity: 0.3,
      },
    ]);
  });

  test("selections run one at a time", async () => {
    const instance = await mount({
      "protein-accession": "P05067",
      "structure-id": "1AAP",
    });
    let finishSelect: () => void = () => undefined;
    instance.visual.select.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishSelect = resolve;
        }),
    );
    await set("highlight", "290:315");
    const clears = instance.visual.clearSelection.mock.calls.length;

    // Interleaved, pdbe-molstar's selections can add to each other's layers.
    await set("highlight", "300:310");
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(clears);

    finishSelect();
    await settle();
    expect(instance.visual.clearSelection).toHaveBeenCalledTimes(clears + 1);
    expect(lastCall(instance.visual.select)).toEqual([
      {
        data: [
          { uniprot_accession: "P05067", color: null, focus: false },
          {
            uniprot_accession: "P05067",
            start_uniprot_residue_number: 300,
            end_uniprot_residue_number: 310,
            color: "#FFEB3B",
            focus: true,
          },
        ],
        keepOpacity: true,
      },
    ]);
  });
});
