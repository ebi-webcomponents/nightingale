import NightingaleVariationCanvas from "../src/nightingale-variation-canvas";
import type {
  VariationData,
  VariationDatum,
} from "@nightingale-elements/nightingale-variation";

const minimalData: VariationData = {
  sequence: "MEEP",
  variants: [
    {
      accession: "v1",
      variant: "A",
      start: 2,
      xrefNames: [],
      hasPredictions: false,
      consequenceType: "missense",
    },
    {
      accession: "v2",
      variant: "G",
      start: 3,
      xrefNames: [],
      hasPredictions: false,
      consequenceType: "missense",
    },
  ],
};

describe("nightingale-variation-canvas", () => {
  let element: NightingaleVariationCanvas;

  beforeEach(() => {
    element = new NightingaleVariationCanvas();
    element.setAttribute("length", "4");
    element.setAttribute("display-start", "1");
    element.setAttribute("display-end", "4");
    element.setAttribute("height", "200");
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test("registers as a custom element", () => {
    expect(customElements.get("nightingale-variation-canvas")).toBeDefined();
  });

  test("processData builds the expected mutation array", () => {
    element.processData(minimalData);
    expect(element.processedData).toBeTruthy();
    expect(element.processedData?.mutationArray).toHaveLength(4);
    expect(element.processedData?.mutationArray[1].variants).toHaveLength(1);
    expect(element.processedData?.mutationArray[2].variants).toHaveLength(1);
    expect(element.processedData?.aaPresence.A).toBe(true);
    expect(element.processedData?.aaPresence.G).toBe(true);
  });

  test("setting data runs processData without throwing", () => {
    expect(() => {
      element.data = minimalData;
    }).not.toThrow();
    expect(element.data).toBe(minimalData);
  });
});

/**
 * Event-dispatch tests: the canvas component reimplements pointer interaction
 * on top of `mousemove`, so we explicitly assert that mouseover/mouseout fire
 * once per actual enter/leave (not on every mousemove). This is the regression
 * guard for the spam bug fixed in this package's first review pass.
 *
 * The hit-test logic itself depends on layout primitives (yScale,
 * getXFromSeqPosition, getBoundingClientRect) that aren't reliable in jsdom,
 * so we stub `getVariantAt` and `getLocalCoords` directly and verify the
 * transition-tracking layer on top.
 */
describe("nightingale-variation-canvas event dispatch", () => {
  let element: NightingaleVariationCanvas;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let internals: any;
  let dispatched: Array<{ type: string; eventType: string }>;

  const variantA: VariationDatum = {
    accession: "vA",
    variant: "A",
    start: 2,
    xrefNames: [],
    hasPredictions: false,
    consequenceType: "missense",
  };
  const variantB: VariationDatum = {
    accession: "vB",
    variant: "G",
    start: 3,
    xrefNames: [],
    hasPredictions: false,
    consequenceType: "missense",
  };

  beforeEach(() => {
    element = new NightingaleVariationCanvas();
    element.setAttribute("length", "4");
    element.setAttribute("display-start", "1");
    element.setAttribute("display-end", "4");
    element.setAttribute("height", "200");
    document.body.appendChild(element);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    internals = element as any;
    internals.getLocalCoords = () => ({ x: 0, y: 0 });

    dispatched = [];
    element.addEventListener("change", (e: Event) => {
      const ce = e as CustomEvent<{ eventType: string }>;
      dispatched.push({ type: e.type, eventType: ce.detail?.eventType });
    });
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  function move(over: VariationDatum | null) {
    internals.getVariantAt = () => over ?? undefined;
    internals.handleMousemove(new MouseEvent("mousemove"));
  }

  test("fires mouseover exactly once when entering a variant", () => {
    move(variantA);
    move(variantA); // same variant — should not re-dispatch
    move(variantA);
    const overs = dispatched.filter((d) => d.eventType === "mouseover");
    expect(overs).toHaveLength(1);
  });

  test("does not fire mouseout while moving over empty space", () => {
    move(null);
    move(null);
    move(null);
    const outs = dispatched.filter((d) => d.eventType === "mouseout");
    expect(outs).toHaveLength(0);
  });

  test("fires mouseout once on leaving a variant for empty space", () => {
    move(variantA);
    dispatched.length = 0;
    move(null);
    move(null);
    expect(dispatched.map((d) => d.eventType)).toEqual(["mouseout"]);
  });

  test("fires mouseout+mouseover when moving directly between variants", () => {
    move(variantA);
    dispatched.length = 0;
    move(variantB);
    expect(dispatched.map((d) => d.eventType)).toEqual([
      "mouseout",
      "mouseover",
    ]);
  });

  test("native mouseout (leaving the SVG) clears the dispatch state", () => {
    move(variantA);
    dispatched.length = 0;
    internals.handleMouseout(new MouseEvent("mouseout"));
    expect(dispatched.map((d) => d.eventType)).toEqual(["mouseout"]);
    // A subsequent mouseout should not double-fire.
    internals.handleMouseout(new MouseEvent("mouseout"));
    expect(
      dispatched.filter((d) => d.eventType === "mouseout"),
    ).toHaveLength(1);
  });
});
