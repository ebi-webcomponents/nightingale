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

/**
 * The data of the last `visual.select` call, without the items' opacity: it
 * is left out when the dimming is kept in place (see "keeping the dimming").
 */
const lastSelection = () => {
  const selects = viewer().visual.select.mock.calls;
  return selects.length
    ? selects[selects.length - 1][0].data.map((item: object) => ({
        ...item,
        opacity: undefined,
      }))
    : undefined;
};

/** Click a residue the way pdbe-molstar's `CustomEvents.add` does. */
const click = (eventData: Record<string, unknown>) => {
  const event = new MouseEvent("PDB.molstar.click", { bubbles: true });
  (event as unknown as { eventData: unknown }).eventData = eventData;
  viewer().container.dispatchEvent(event);
};

/** pdbe-molstar's click payload for a residue of a file without SIFTS. */
const modelResidue = (authSeqId: number) => ({
  auth_asym_id: "A",
  label_asym_id: "A",
  seq_id: authSeqId - 29,
  auth_seq_id: authSeqId,
});

/** pdbe-molstar's click payload for 1aap's chain A residue 10 (UniProt 296). */
const pdbResidue = {
  entry_id: "1aap",
  auth_asym_id: "A",
  label_asym_id: "A",
  unp_accession: "P05067",
  unp_seq_id: 296,
  seq_id: 10,
  auth_seq_id: 10,
};

type RangeOptions = { color?: string | null; focus?: boolean };

/** The selection item for a `highlight` range in author numbering. */
const authRange = (
  beg: number,
  end: number,
  { color = "#FFEB3B", focus = true }: RangeOptions = {},
) => ({
  beg_auth_seq_id: beg,
  end_auth_seq_id: end,
  color,
  focus,
});

/** The selection item for a `highlight` range in UniProt numbering. */
const uniProtRange = (
  accession: string,
  start: number,
  end: number,
  { color = "#FFEB3B", focus = true }: RangeOptions = {},
) => ({
  uniprot_accession: accession,
  start_uniprot_residue_number: start,
  end_uniprot_residue_number: end,
  color,
  focus,
});

/**
 * The selection item emphasizing the entry's chains, found by SIFTS. It
 * precedes any range items, and is framed only when there are none.
 */
const entryChains = (accession: string, focus = false) => ({
  uniprot_accession: accession,
  color: null,
  focus,
});

describe("nightingale-structure residue numbering", () => {
  let element: NightingaleStructure | undefined;
  let changes: string[];

  const track = (el: NightingaleStructure) => {
    el.addEventListener("change", (e) =>
      changes.push((e as CustomEvent).detail.highlight),
    );
    return el;
  };

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
    PDBeMolstarPlugin.hasSifts = PDBeMolstarPlugin.defaultHasSifts;
    changes = [];
  });

  afterEach(() => {
    if (element?.isConnected) document.documentElement.removeChild(element);
    element = undefined;
    PDBeMolstarPlugin.hasSifts = PDBeMolstarPlugin.defaultHasSifts;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch;
  });

  describe("a file without SIFTS mapping and protein-accession", () => {
    test("model-url highlights by author number", async () => {
      element = mount({
        "protein-accession": "P05067",
        "model-url": "https://example.org/P05067_30-189.cif",
        highlight: "40:50",
      });
      await settle();

      // A uniprot_accession query would match nothing in this file.
      expect(lastSelection()).toEqual([authRange(40, 50)]);
    });

    test("model-url clicks emit the author number", async () => {
      element = track(
        mount({
          "protein-accession": "P05067",
          "model-url": "https://example.org/P05067_30-189.cif",
        }),
      );
      await settle();

      click(modelResidue(35));
      expect(changes).toEqual(["35:35"]);
      expect(element.highlight).toBe("35:35");
    });

    test("a custom-download-url archive file highlights by author number", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        "custom-download-url": "https://example.org/pdb/",
        highlight: "10:20",
      });
      await settle();

      // Nor is the entry emphasized: its uniprot_accession query would match
      // nothing either, and dim the whole structure.
      expect(lastSelection()).toEqual([authRange(10, 20)]);
    });

    // Not a regression test (as before the SIFTS check): guards against
    // numbering AlphaFold models by UniProt.
    test("an AlphaFold model clicks by author number", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: async () => [
          {
            modelEntityId: "AF-P05067-F1",
            chainId: "A",
            cifUrl: "https://example.org/AF-P05067-F1.cif",
          },
        ],
      });
      element = track(
        mount({
          "protein-accession": "P05067",
          "structure-id": "AF-P05067-F1",
          highlight: "10:20",
        }),
      );
      await settle();
      // The range keeps the pLDDT colours.
      expect(lastSelection()).toEqual([authRange(10, 20, { color: null })]);

      click({ auth_asym_id: "A", seq_id: 42, auth_seq_id: 42 });
      expect(changes).toEqual(["42:42"]);
    });
  });

  // Not regression tests (as before the SIFTS check): guard against the check
  // turning UniProt numbering off where the file has the mapping.
  describe("a file with SIFTS mapping and protein-accession", () => {
    test("highlights and clicks by UniProt number", async () => {
      element = track(
        mount({
          "protein-accession": "P05067",
          "structure-id": "1AAP",
          highlight: "296:300",
        }),
      );
      await settle();
      expect(lastSelection()).toEqual([
        entryChains("P05067"),
        uniProtRange("P05067", 296, 300),
      ]);

      click(pdbResidue);
      expect(changes).toEqual(["296:296"]);
    });

    test("loaded by model-url, also numbers by UniProt", async () => {
      PDBeMolstarPlugin.hasSifts = () => true;
      element = track(
        mount({
          "protein-accession": "P05067",
          "model-url": "https://example.org/1aap_updated.cif",
          highlight: "296:300",
        }),
      );
      await settle();
      expect(lastSelection()).toEqual([
        entryChains("P05067"),
        uniProtRange("P05067", 296, 300),
      ]);

      click(pdbResidue);
      expect(changes).toEqual(["296:296"]);
    });

    test("ignores a residue SIFTS doesn't map", async () => {
      element = track(
        mount({ "protein-accession": "P05067", "structure-id": "1AAP" }),
      );
      await settle();

      click({ auth_asym_id: "A", seq_id: 60, auth_seq_id: 60 });
      expect(changes).toEqual([]);
      expect(element.message?.title).toBe("Error");
    });
  });

  describe("a PDB entry without protein-accession", () => {
    test("clicks emit the author number that highlights the clicked residue", async () => {
      element = track(mount({ "structure-id": "1AAP" }));
      await settle();

      click(pdbResidue);
      expect(changes).toEqual(["10:10"]);
      expect(element.message?.content).toMatch(/<b>Residue<\/b>: 10$/);
      await settle();
      expect(lastSelection()).toEqual([authRange(10, 10)]);
    });
  });

  describe("changing highlight-color", () => {
    test("without a highlight only changes the color", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const instance = viewer();
      // The load's entry emphasis.
      expect(lastSelection()).toEqual([entryChains("P05067", true)]);
      instance.visual.select.mockClear();
      instance.visual.clearSelection.mockClear();

      element.setAttribute("highlight-color", "#FF0000");
      await settle();

      expect(instance.visual.setColor).toHaveBeenCalledWith({
        highlight: "#FF0000",
        select: "#FF0000",
      });
      // Clearing a highlight resets the camera.
      expect(instance.visual.reset).not.toHaveBeenCalled();
      expect(instance.visual.clearSelection).not.toHaveBeenCalled();
      expect(instance.visual.select).not.toHaveBeenCalled();
    });

    test("re-applies a highlight in the new color", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        highlight: "296:300",
      });
      await settle();
      const instance = viewer();

      expect(lastSelection()).toEqual([
        entryChains("P05067"),
        uniProtRange("P05067", 296, 300),
      ]);

      element.setAttribute("highlight-color", "#FF000080");
      await settle();

      expect(instance.visual.select).toHaveBeenCalledTimes(2);
      // Without moving the camera, which the user may have moved since.
      expect(lastSelection()).toEqual([
        entryChains("P05067"),
        uniProtRange("P05067", 296, 300, { color: "#FF0000", focus: false }),
      ]);
      expect(instance.visual.reset).not.toHaveBeenCalled();
    });
  });

  describe("changing only protein-accession", () => {
    test("of a PDB id re-applies the highlight without reloading", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        highlight: "296:300",
      });
      await settle();
      const instance = viewer();

      element.setAttribute("protein-accession", "P12345");
      await settle();

      // Only the initial load.
      expect(instance.visual.update).toHaveBeenCalledTimes(1);
      expect(lastSelection()).toEqual([
        entryChains("P12345"),
        uniProtRange("P12345", 296, 300, { focus: false }),
      ]);

      element.removeAttribute("protein-accession");
      await settle();
      // Only the initial load.
      expect(instance.visual.update).toHaveBeenCalledTimes(1);
      expect(lastSelection()).toEqual([authRange(296, 300, { focus: false })]);
    });

    test("of a model-url doesn't reload", async () => {
      element = mount({
        "protein-accession": "P05067",
        "model-url": "https://example.org/P05067_30-189.cif",
      });
      await settle();
      const instance = viewer();

      element.setAttribute("protein-accession", "P12345");
      await settle();

      // Only the initial load.
      expect(instance.visual.update).toHaveBeenCalledTimes(1);
      // Nothing to re-apply.
      expect(instance.visual.clearSelection).not.toHaveBeenCalled();
      expect(instance.visual.reset).not.toHaveBeenCalled();
    });

    // Not a regression test (as before): guards against skipping the reload
    // the AlphaFold lookup needs.
    test("of an AlphaFold id reloads the other protein's model", async () => {
      global.fetch = jest.fn().mockImplementation(async (url: string) => ({
        json: async () => [
          {
            modelEntityId: "AF-P05067-F1",
            chainId: "A",
            cifUrl: `https://example.org/${url.slice(-6)}.cif`,
          },
        ],
      }));
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F1",
      });
      await settle();
      const instance = viewer();

      element.setAttribute("protein-accession", "P12345");
      await settle();

      expect(instance.visual.update).toHaveBeenCalledTimes(2);
      expect(instance.visual.update.mock.calls[1][0].customData.url).toBe(
        "https://example.org/P12345.cif",
      );
    });
  });
});
