import NightingaleVariationCanvas from "../src/nightingale-variation-canvas";
import type { VariationData } from "@nightingale-elements/nightingale-variation";

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
