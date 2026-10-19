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
