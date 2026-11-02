// Under jest's transpile-only ts-jest the CJS dompurify's default import is
// undefined, so render() would throw whenever a message is shown while
// structure-id is set. Production builds use the ESM bundle.
jest.mock("dompurify", () => ({
  __esModule: true,
  default: { sanitize: (s: string) => s },
}));

import NightingaleStructure from "../src/index";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdbeMolstarStyles = require("./stubs/pdbe-molstar-css.js").default;

const STYLE_ID = "nightingale-pdbe-molstar-styles";

/** The pdbe-molstar stylesheets in `root`. */
const styles = (root: ParentNode) =>
  root.querySelectorAll<HTMLStyleElement>(`#${STYLE_ID}`);

const added: Element[] = [];
const add = (parent: Node, element: Element) => {
  parent.appendChild(element);
  added.push(element);
  return element;
};

afterEach(() => {
  added.splice(0).forEach((element) => element.remove());
  styles(document).forEach((style) => style.remove());
});

describe("pdbe-molstar's stylesheet", () => {
  test("is added to the document head once", () => {
    add(document.body, new NightingaleStructure());
    add(document.body, new NightingaleStructure());

    expect(styles(document.head)).toHaveLength(1);
    expect(styles(document.head)[0].textContent).toBe(pdbeMolstarStyles);
  });

  test("is added once to the shadow root the element is in", () => {
    const host = add(document.body, document.createElement("div"));
    const shadow = host.attachShadow({ mode: "open" });
    add(shadow, new NightingaleStructure());
    add(shadow, new NightingaleStructure());

    // The document's styles don't apply inside a shadow root.
    expect(styles(shadow)).toHaveLength(1);
    expect(styles(shadow)[0].textContent).toBe(pdbeMolstarStyles);
    expect(styles(document)).toHaveLength(0);
  });

  test("follows the element into a shadow root", () => {
    const element = add(document.body, new NightingaleStructure());
    const host = add(document.body, document.createElement("div"));
    const shadow = host.attachShadow({ mode: "open" });

    shadow.appendChild(element);

    expect(styles(shadow)).toHaveLength(1);
  });
});
