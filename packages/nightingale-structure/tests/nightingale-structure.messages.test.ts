// Messages are HTML built from attribute values and structure-file data, which
// the page may not control. Here with the real DOMPurify (the other suites
// pass content through unchanged): its CJS default import is undefined under
// ts-jest's transpile-only mode, so it is wrapped as an ES module.
jest.mock("dompurify", () => ({
  __esModule: true,
  default: jest.requireActual("dompurify"),
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

const STYLE = '<style id="injected">body { background: red }</style>';
const FORM =
  '<form id="injected" action="https://example.org/"><input name="password"></form>';

let element: NightingaleStructure;

const mount = (attributes: Record<string, string>) => {
  element = new NightingaleStructure();
  Object.entries(attributes).forEach(([name, value]) =>
    element.setAttribute(name, value),
  );
  document.body.appendChild(element);
  return element;
};

/** The rendered message content. */
const content = () =>
  element.querySelector(".structure-viewer-message-content");

beforeEach(() => {
  PDBeMolstarPlugin.instances.length = 0;
});

afterEach(() => {
  element?.remove();
});

describe("message content from attributes and structure files", () => {
  test("is shown as text, not markup", async () => {
    mount({ "structure-id": `AF-P05067-F1${STYLE}` });
    await settle();

    expect(element.message?.content).toContain("Set protein-accession");
    expect(document.getElementById("injected")).toBeNull();
    expect(content()?.textContent).toBe(
      `Set protein-accession to load AF entry "AF-P05067-F1${STYLE}"`,
    );
  });

  test("is shown as text in a load error", async () => {
    mount({ "model-url": "https://example.org/model.cif" });
    await settle();
    const [instance] = PDBeMolstarPlugin.instances;
    instance.visual.update.mockRejectedValueOnce(new Error("404"));

    element.setAttribute("model-url", `https://example.org/m.cif"${FORM}`);
    await settle();

    expect(element.message?.title).toBe("Error");
    expect(document.getElementById("injected")).toBeNull();
    expect(content()?.querySelector("form, input")).toBeNull();
    expect(content()?.textContent).toBe(
      `Couldn't load structure "https://example.org/m.cif"${FORM}"`,
    );
  });

  test("keeps the tooltip's own markup, and shows a chain id as text", async () => {
    mount({ "model-url": "https://example.org/model.cif" });
    await settle();
    const [instance] = PDBeMolstarPlugin.instances;
    const event = new MouseEvent("PDB.molstar.click", { bubbles: true });
    (event as unknown as { eventData: unknown }).eventData = {
      auth_asym_id: `A${STYLE}`,
      auth_seq_id: 10,
    };
    instance.container.dispatchEvent(event);
    await settle();

    expect(document.getElementById("injected")).toBeNull();
    expect(content()?.querySelector("span[data-article-id]")).not.toBeNull();
    expect(content()?.querySelector("b")?.textContent).toBe("Residue");
    expect(content()?.textContent).toBe(`Chain A${STYLE}Residue: 10`);
  });
});
