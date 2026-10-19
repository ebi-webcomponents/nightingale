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

/*
 * While `holdLoad` is set, a new viewer's initial load (its first
 * `visual.update`) is held back until `releaseLoad()`, so tests can act while
 * the initial load is in flight. The stub's constructor assigns `this.render`;
 * this prototype accessor intercepts that assignment and wraps it.
 */
let holdLoad = false;
/** While set, the stub's `render()` rejects, as when WebGL is unavailable. */
let failRender = false;
const heldLoads: ((error?: Error) => void)[] = [];
/** Complete the held loads, or fail them as pdbe-molstar does: reject. */
const releaseLoad = (success = true) => {
  heldLoads
    .splice(0)
    .forEach((settle) =>
      settle(success ? undefined : new Error("Failed to download")),
    );
};
Object.defineProperty(PDBeMolstarPlugin.prototype, "render", {
  configurable: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(this: any, original: (...args: unknown[]) => Promise<void>) {
    Object.defineProperty(this, "render", {
      value: jest.fn(async (container: HTMLElement, params: unknown) => {
        if (failRender) {
          this.container = container;
          throw new Error("WebGL unavailable");
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (holdLoad) heldLoads.push(deferUpdate(this));
        return original(container, params);
      }),
      writable: true,
      configurable: true,
    });
  },
});

const mockAlphaFoldApi = (predictions: object[]) => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => predictions });
};

/**
 * Hold the AlphaFold API's answers back; call the result to answer a lookup
 * (by default the latest), or to fail it with a network error.
 */
const deferAlphaFoldApi = () => {
  const lookups: {
    resolve: (response: object) => void;
    reject: (error: Error) => void;
  }[] = [];
  global.fetch = jest.fn().mockImplementation(
    () =>
      new Promise((resolve, reject) => {
        lookups.push({ resolve, reject });
      }),
  );
  return (predictions: object[] | Error, index = lookups.length - 1) => {
    if (predictions instanceof Error) lookups[index].reject(predictions);
    else lookups[index].resolve({ json: async () => predictions });
  };
};

/** Hold back the settling of `instance`'s next `visual.update`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deferUpdate = (instance: any) => {
  let settleUpdate: (error?: Error) => void = () => undefined;
  instance.visual.update.mockImplementationOnce(
    () =>
      new Promise<boolean>((resolve, reject) => {
        settleUpdate = (error) => (error ? reject(error) : resolve(true));
      }),
  );
  return (error?: Error) => settleUpdate(error);
};

const prediction = (id: string) => ({
  modelEntityId: id,
  chainId: "A",
  cifUrl: `https://example.org/${id}.cif`,
});

const mount = (attributes: Record<string, string>) => {
  const element = new NightingaleStructure();
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  document.documentElement.appendChild(element);
  return element;
};

/**
 * Fire a residue click the way pdbe-molstar's `CustomEvents.add` does: on the
 * element the latest viewer was rendered into.
 */
const click = () => {
  const event = new MouseEvent("PDB.molstar.click", { bubbles: true });
  (event as unknown as { eventData: unknown }).eventData = {
    auth_asym_id: "A",
    unp_accession: "P05067",
    unp_seq_id: 42,
  };
  const instances = PDBeMolstarPlugin.instances;
  instances[instances.length - 1].container.dispatchEvent(event);
};

/** The data of the last `visual.select` call. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastSelection = (instance: any) => {
  const selects = instance.visual.select.mock.calls;
  return selects.length ? selects[selects.length - 1][0].data : undefined;
};

/** Collects unhandled promise rejections while a test runs. */
const unhandledRejections: unknown[] = [];
const onUnhandledRejection = (reason: unknown) => {
  unhandledRejections.push(reason);
};

/** The moleculeId the viewer was last asked to load. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lastLoadedId = (instance: any): string | undefined => {
  const updates = instance.visual.update.mock.calls;
  return updates.length ? updates[updates.length - 1][0].moleculeId : undefined;
};

/** The params of the viewer's initial load: its first `visual.update`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialLoad = (instance: any) =>
  instance.visual.update.mock.calls[0]?.[0];

/** The `visual.update` calls that reloaded the viewer after its initial load. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reloads = (instance: any) => instance.visual.update.mock.calls.slice(1);

describe("nightingale-structure lifecycle", () => {
  let element: NightingaleStructure | undefined;

  beforeAll(() => {
    process.on("unhandledRejection", onUnhandledRejection);
  });

  afterAll(() => {
    process.off("unhandledRejection", onUnhandledRejection);
  });

  beforeEach(() => {
    PDBeMolstarPlugin.instances.length = 0;
    holdLoad = false;
    heldLoads.length = 0;
    failRender = false;
    unhandledRejections.length = 0;
  });

  afterEach(async () => {
    if (element?.isConnected) document.documentElement.removeChild(element);
    element = undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch;
    // Node reports unhandled rejections a macrotask after they occur.
    await settle();
    if (unhandledRejections.length) {
      throw new Error(
        `Unhandled rejections: ${unhandledRejections.join("; ")}`,
      );
    }
  });

  describe("creating the viewer once a source exists", () => {
    test("structure-id set after the first render", async () => {
      element = mount({ "protein-accession": "P05067" });
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(0);

      element.setAttribute("structure-id", "1AAP");
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(initialLoad(PDBeMolstarPlugin.instances[0]).moleculeId).toBe(
        "1aap",
      );
    });

    test("PDB id set after an AlphaFold lookup found no model", async () => {
      mockAlphaFoldApi([]);
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F1",
      });
      await settle();
      expect(global.fetch).toHaveBeenCalled();
      expect(PDBeMolstarPlugin.instances).toHaveLength(0);

      element.setAttribute("structure-id", "1AAP");
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(element.message).toBeNull();
    });

    test("matching AlphaFold id set after a lookup found no model", async () => {
      mockAlphaFoldApi([
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://example.org/AF-P05067-F1.cif",
        },
      ]);
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F9",
      });
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(0);
      // The "Loading" message is replaced rather than left up forever.
      expect(element.message?.title).toBe("Error");

      element.setAttribute("structure-id", "AF-P05067-F1");
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(initialLoad(PDBeMolstarPlugin.instances[0]).customData.url).toBe(
        "https://example.org/AF-P05067-F1.cif",
      );
    });

    test("PDB id set while an AlphaFold lookup with no model is in flight", async () => {
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F9",
      });
      await settle();
      element.setAttribute("structure-id", "1AAP");
      await settle();
      answerAlphaFoldApi([]);
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(initialLoad(PDBeMolstarPlugin.instances[0]).moleculeId).toBe(
        "1aap",
      );
    });

    test("a 'no model' answer for a replaced AlphaFold id shows no error while the new structure loads", async () => {
      const answerAlphaFoldApi = deferAlphaFoldApi();
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F9",
      });
      await settle();
      element.setAttribute("structure-id", "1AAP");
      await settle();
      answerAlphaFoldApi([]);
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(element.message?.title).not.toBe("Error");
    });
  });

  describe("AlphaFold lookups", () => {
    test("a stale 'no model' answer leaves a later structure's view alone", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "2XYZ",
      });
      await settle();
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element.setAttribute("structure-id", "AF-P05067-F9");
      await settle();
      element.setAttribute("structure-id", "1AAP");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(lastLoadedId(instance)).toBe("1aap");

      answerAlphaFoldApi([]);
      await settle();
      expect(element.message).toBeNull();
    });

    test("a stale network error leaves a later structure's view alone", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "2XYZ",
      });
      await settle();
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element.setAttribute("structure-id", "AF-P05067-F9");
      await settle();
      element.setAttribute("structure-id", "1AAP");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(lastLoadedId(instance)).toBe("1aap");

      answerAlphaFoldApi(new Error("Failed to fetch"));
      await settle();
      expect(element.message).toBeNull();
    });

    // Not a regression test (the original also ignored it): guards the
    // staleness check of reloads triggered by protein-accession.
    test("a stale 'no model' answer for a previous protein-accession leaves the view alone", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "2XYZ",
      });
      await settle();
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element.setAttribute("structure-id", "AF-P05067-F1");
      await settle();
      element.setAttribute("protein-accession", "P12345");
      await settle();
      expect(
        (global.fetch as jest.Mock).mock.calls.map(([url]) => url),
      ).toEqual([
        expect.stringMatching(/P05067$/),
        expect.stringMatching(/P12345$/),
      ]);

      answerAlphaFoldApi([prediction("AF-P05067-F1")], 1);
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(reloads(instance)).toHaveLength(1);
      expect(element.message).toBeNull();

      answerAlphaFoldApi([], 0);
      await settle();
      expect(element.message).toBeNull();
      expect(reloads(instance)).toHaveLength(1);
    });
  });

  describe("structures that can't be loaded", () => {
    test("an AlphaFold id with no model empties the viewer and highlights nothing", async () => {
      mockAlphaFoldApi([]);
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        highlight: "10:20",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(instance.visual.select).toHaveBeenCalledTimes(1);

      element.setAttribute("structure-id", "AF-P05067-F9");
      await settle();
      expect(instance.clear).toHaveBeenCalledTimes(1);
      expect(element.message).toEqual({
        title: "Error",
        content: 'No AF entry "AF-P05067-F9" for P05067',
      });

      // Neither in AlphaFold (author) numbering on the PDB structure that was
      // displayed, nor on the empty viewer.
      element.setAttribute("highlight", "30:40");
      await settle();
      const changes: string[] = [];
      element.addEventListener("change", (e) =>
        changes.push((e as CustomEvent).detail.highlight),
      );
      click();
      expect(instance.visual.select).toHaveBeenCalledTimes(1);
      expect(changes).toEqual([]);
    });

    test("a load in flight finishes before the viewer is emptied", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      const finishUpdate = deferUpdate(instance);
      element.setAttribute("structure-id", "2XYZ");
      await settle();
      mockAlphaFoldApi([]);
      element.setAttribute("structure-id", "AF-P05067-F9");
      await settle();
      expect(instance.clear).not.toHaveBeenCalled();

      finishUpdate();
      await settle();
      expect(instance.clear).toHaveBeenCalledTimes(1);
      expect(element.message?.title).toBe("Error");
    });

    test("a failed load reports an error instead of staying 'Loading'", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      instance.visual.update.mockRejectedValueOnce(new Error("404"));

      element.setAttribute("structure-id", "2XYZ");
      await settle();
      expect(element.message).toEqual({
        title: "Error",
        content: `Couldn't load structure "2XYZ"`,
      });

      element.setAttribute("highlight", "10:20");
      await settle();
      expect(instance.visual.select).not.toHaveBeenCalled();
    });

    test("a failed initial load reports an error, and a new structure-id retries", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "9ZZZ",
      });
      await settle();
      const [first] = PDBeMolstarPlugin.instances;
      releaseLoad(false);
      await settle();
      expect(element.message).toEqual({
        title: "Error",
        content: `Couldn't load structure "9ZZZ"`,
      });
      expect(first.plugin.dispose).toHaveBeenCalledTimes(1);
      expect(first.container.isConnected).toBe(false);

      holdLoad = false;
      element.setAttribute("structure-id", "1AAP");
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(2);
      expect(initialLoad(PDBeMolstarPlugin.instances[1]).moleculeId).toBe(
        "1aap",
      );
      expect(element.message).toBeNull();
    });

    test("a model-url that can't be loaded shows its error", async () => {
      holdLoad = true;
      element = mount({ "model-url": "https://example.org/missing.cif" });
      await settle();
      releaseLoad(false);
      await settle();

      const overlay = element.querySelector(".structure-viewer-messages");
      expect(overlay?.textContent).toContain(
        `Couldn't load structure "https://example.org/missing.cif"`,
      );
    });

    test("a superseded load fails silently", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        highlight: "10:20",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      const failFirst = deferUpdate(instance);
      const finishSecond = deferUpdate(instance);
      element.setAttribute("structure-id", "2XYZ");
      await settle();
      element.setAttribute("structure-id", "3ABC");
      await settle();

      // As pdbe-molstar rejects a load whose structure a newer load removed.
      failFirst(new Error("Invalid data cell."));
      await settle();
      expect(element.message).toEqual({ title: "Loading", content: "3ABC" });

      finishSecond();
      await settle();
      expect(element.message).toBeNull();
      expect(lastLoadedId(instance)).toBe("3abc");
      expect(instance.visual.select).toHaveBeenCalledTimes(2);
    });

    test("a viewer that fails to render reports an error and leaves no element behind", async () => {
      failRender = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();

      const [instance] = PDBeMolstarPlugin.instances;
      expect(instance.container.isConnected).toBe(false);
      expect(element.message).toEqual({
        title: "Error",
        content: `Couldn't load structure "1AAP"`,
      });
      // afterEach checks for unhandled rejections.
    });
  });

  describe("reloads in quick succession", () => {
    test("never run two loads at once", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
        highlight: "10:20",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      // pdbe-molstar loads started close together can both finish, leaving
      // both structures displayed.
      const finishLoads: (() => void)[] = [];
      let loading = 0;
      let mostLoading = 0;
      instance.visual.update.mockImplementation(
        () =>
          new Promise<boolean>((resolve) => {
            loading += 1;
            mostLoading = Math.max(mostLoading, loading);
            finishLoads.push(() => {
              loading -= 1;
              resolve(true);
            });
          }),
      );
      element.setAttribute("structure-id", "1BRS");
      await element.updateComplete;
      element.setAttribute("structure-id", "2RH1");
      await settle();
      expect(element.message).toEqual({ title: "Loading", content: "2RH1" });

      while (finishLoads.length) {
        finishLoads.shift()!();
        // eslint-disable-next-line no-await-in-loop
        await settle();
      }
      expect(mostLoading).toBe(1);
      expect(lastLoadedId(instance)).toBe("2rh1");
      expect(element.message).toBeNull();
      expect(instance.visual.select).toHaveBeenCalledTimes(2);
    });

    test("only the latest of several waiting reloads loads", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      const finishFirst = deferUpdate(instance);
      element.setAttribute("structure-id", "1BRS");
      await settle();
      element.setAttribute("structure-id", "2RH1");
      await settle();
      element.setAttribute("structure-id", "6IYC");
      await settle();

      finishFirst();
      await settle();
      expect(
        reloads(instance).map(
          ([params]: [{ moleculeId: string }]) => params.moleculeId,
        ),
      ).toEqual(["1brs", "6iyc"]);
      expect(element.message).toBeNull();
    });
  });

  describe("highlighting during a reload", () => {
    test("a highlight set while a reload is in flight is applied after it", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      const finishUpdate = deferUpdate(instance);
      element.setAttribute("structure-id", "2XYZ");
      await settle();
      element.setAttribute("highlight", "10:20");
      await settle();
      expect(instance.visual.select).not.toHaveBeenCalled();
      expect(instance.visual.clearSelection).not.toHaveBeenCalled();

      finishUpdate();
      await settle();
      expect(instance.visual.select).toHaveBeenCalledTimes(1);
      expect(lastSelection(instance)).toEqual([
        expect.objectContaining({
          start_uniprot_residue_number: 10,
          end_uniprot_residue_number: 20,
        }),
      ]);
    });

    test("a failing selection is not left as an unhandled rejection", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      instance.visual.clearSelection.mockRejectedValueOnce(
        new TypeError("Cannot read properties of undefined (reading 'ref')"),
      );
      element.setAttribute("highlight", "10:20");
      await settle();
      instance.visual.select.mockRejectedValueOnce(
        new TypeError("Cannot read properties of undefined (reading 'ref')"),
      );
      element.setAttribute("highlight", "30:40");
      await settle();
      instance.visual.clearSelection.mockRejectedValueOnce(new Error("busy"));
      element.removeAttribute("highlight");
      await settle();
      // afterEach checks for unhandled rejections.
      expect(instance.visual.select).toHaveBeenCalledTimes(1);
    });
  });

  describe("attribute changes during the initial load", () => {
    test("a changed structure-id is loaded once the first load completes", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(initialLoad(instance).moleculeId).toBe("1aap");

      element.setAttribute("structure-id", "2XYZ");
      await settle();
      releaseLoad();
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(lastLoadedId(instance)).toBe("2xyz");
    });

    test("a highlight and structure-id set during the load are applied to the new structure", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      element.setAttribute("highlight", "10:20");
      element.setAttribute("structure-id", "2XYZ");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;

      releaseLoad();
      await settle();

      expect(lastLoadedId(instance)).toBe("2xyz");
      const [select] = instance.visual.select.mock.invocationCallOrder;
      const [update] = instance.visual.update.mock.invocationCallOrder;
      expect(select).toBeGreaterThan(update);
    });

    // Not a regression test (the original first load already applied the
    // highlight): covers the path where the source is unchanged, so no reload
    // re-applies it.
    test("a highlight set during the load is applied after it", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      element.setAttribute("highlight", "10:20");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(instance.visual.select).not.toHaveBeenCalled();

      releaseLoad();
      await settle();

      expect(instance.visual.select).toHaveBeenCalledTimes(1);
      expect(instance.visual.select.mock.calls[0][0].data).toEqual([
        expect.objectContaining({
          start_uniprot_residue_number: 10,
          end_uniprot_residue_number: 20,
        }),
      ]);
    });

    test("a changed highlight-color is applied after the load", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      element.setAttribute("highlight-color", "#FF0000");
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;

      releaseLoad();
      await settle();

      expect(instance.visual.setColor).toHaveBeenCalledWith({
        highlight: "#FF0000",
        select: "#FF0000",
      });
    });
  });

  describe("connecting and disconnecting", () => {
    test("a viewer whose load completes after disconnect is disposed", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;

      document.documentElement.removeChild(element);
      await settle();
      releaseLoad();
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      expect(instance.plugin.dispose).toHaveBeenCalledTimes(1);
    });

    test("a re-appended element creates a new viewer and keeps responding", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const [first] = PDBeMolstarPlugin.instances;

      document.documentElement.removeChild(element);
      expect(first.plugin.dispose).toHaveBeenCalledTimes(1);

      document.documentElement.appendChild(element);
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(2);
      const [, second] = PDBeMolstarPlugin.instances;
      expect(initialLoad(second).moleculeId).toBe("1aap");

      element.setAttribute("structure-id", "2XYZ");
      await settle();
      expect(lastLoadedId(second)).toBe("2xyz");
    });

    test("a re-appended element emits one change event per click", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      for (let i = 0; i < 3; i += 1) {
        document.documentElement.removeChild(element);
        document.documentElement.appendChild(element);
        // eslint-disable-next-line no-await-in-loop
        await settle();
      }
      expect(PDBeMolstarPlugin.instances).toHaveLength(4);

      const changes: string[] = [];
      element.addEventListener("change", (e) =>
        changes.push((e as CustomEvent).detail.highlight),
      );
      click();
      expect(changes).toEqual(["42:42"]);
    });

    test("a viewer disposed after its load does not answer clicks", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      document.documentElement.removeChild(element);
      releaseLoad();
      await settle();
      holdLoad = false;
      document.documentElement.appendChild(element);
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(2);

      const changes: string[] = [];
      element.addEventListener("change", (e) =>
        changes.push((e as CustomEvent).detail.highlight),
      );
      click();
      expect(changes).toEqual(["42:42"]);
    });

    test("an element removed during the AlphaFold lookup creates no viewer", async () => {
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "AF-P05067-F1",
      });
      await settle();
      document.documentElement.removeChild(element);
      answerAlphaFoldApi([
        {
          modelEntityId: "AF-P05067-F1",
          chainId: "A",
          cifUrl: "https://example.org/AF-P05067-F1.cif",
        },
      ]);
      await settle();

      expect(PDBeMolstarPlugin.instances).toHaveLength(0);
    });

    test("an element removed while its catch-up reload awaits an AlphaFold lookup loads nothing", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element.setAttribute("structure-id", "AF-P05067-F1");
      await settle();
      releaseLoad();
      await settle();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      document.documentElement.removeChild(element);
      answerAlphaFoldApi([prediction("AF-P05067-F1")]);
      await settle();
      const [instance] = PDBeMolstarPlugin.instances;
      expect(reloads(instance)).toHaveLength(0);
      // afterEach checks for unhandled rejections.
    });

    test("a re-appended element's viewer gets no load from a stale reload", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      const answerAlphaFoldApi = deferAlphaFoldApi();
      element.setAttribute("structure-id", "AF-P05067-F1");
      await settle();
      releaseLoad();
      await settle();

      holdLoad = false;
      document.documentElement.removeChild(element);
      document.documentElement.appendChild(element);
      await settle();
      expect(global.fetch).toHaveBeenCalledTimes(2);
      answerAlphaFoldApi([prediction("AF-P05067-F1")], 1);
      await settle();
      const [first, second] = PDBeMolstarPlugin.instances;
      expect(initialLoad(second).customData.url).toBe(
        "https://example.org/AF-P05067-F1.cif",
      );

      answerAlphaFoldApi([prediction("AF-P05067-F1")], 0);
      await settle();
      expect(PDBeMolstarPlugin.instances).toHaveLength(2);
      expect(reloads(first)).toHaveLength(0);
      expect(reloads(second)).toHaveLength(0);
    });

    test("a re-appended element renders its new viewer into a fresh element", async () => {
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      document.documentElement.removeChild(element);
      document.documentElement.appendChild(element);
      await settle();

      // pdbe-molstar mounts a React root on its target that it never unmounts.
      const [first, second] = PDBeMolstarPlugin.instances;
      expect(second.container).not.toBe(first.container);
      expect(first.container.isConnected).toBe(false);
      const parent = element.renderRoot.querySelector("#molstar-parent")!;
      expect(Array.from(parent.children)).toEqual([second.container]);
    });

    test("an element re-appended during its initial load ends with one live viewer", async () => {
      holdLoad = true;
      element = mount({
        "protein-accession": "P05067",
        "structure-id": "1AAP",
      });
      await settle();
      document.documentElement.removeChild(element);
      document.documentElement.appendChild(element);
      await settle();
      holdLoad = false;
      releaseLoad();
      await settle();

      // The viewer it was loading is kept rather than loaded again.
      expect(PDBeMolstarPlugin.instances).toHaveLength(1);
      const [instance] = PDBeMolstarPlugin.instances;
      expect(instance.plugin.dispose).not.toHaveBeenCalled();
      const parent = element.renderRoot.querySelector("#molstar-parent")!;
      expect(Array.from(parent.children)).toEqual([instance.container]);
      element.setAttribute("structure-id", "2XYZ");
      await settle();
      expect(lastLoadedId(instance)).toBe("2xyz");
    });
  });
});
