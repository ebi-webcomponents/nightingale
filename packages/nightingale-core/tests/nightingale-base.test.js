import NightingaleBaseElement, { withZoom, withDimensions } from "../src/index";

describe("nightingale-base-element", () => {
  test("creates nightingale-base-element", () => {
    window.customElements.define(
      "nightingale-base-element",
      NightingaleBaseElement
    );
    const element = document.createElement("nightingale-base-element");
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.implements).toEqual([]);
    expect(element.dependencies).toEqual([]);
  });

  test("creates nightingale-with-dimensions", () => {
    const ElementWithDimension = withDimensions(NightingaleBaseElement);

    window.customElements.define(
      "with-dimensions-element",
      ElementWithDimension
    );
    const element = document.createElement("with-dimensions-element");
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(NightingaleBaseElement);
    expect(element.implements).toEqual(["WITH_DIMENSION"]);
    expect(element.dependencies).toEqual([]);
  });

  test("fails creating nightingale-with-zoom witouth dimensions", () => {
    expect(() => {
      const ElementWithZoom = withZoom(NightingaleBaseElement);
      window.customElements.define("with-zoom-element", ElementWithZoom);
      // eslint-disable-next-line no-new
      new ElementWithZoom();
    }).toThrow();
  });

  test("crea nightingale-with-zoom-with-dimensions", () => {
    const ElementWithDimensionZoom = withDimensions(
      withZoom(NightingaleBaseElement)
    );
    window.customElements.define(
      "with-dimensions-zoom-element",
      ElementWithDimensionZoom
    );

    const element = document.createElement("with-dimensions-zoom-element");
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element).toBeInstanceOf(NightingaleBaseElement);
    expect(element.implements).toContain("WITH_ZOOM");
    expect(element.implements).toContain("WITH_DIMENSION");
    expect(element.dependencies).toContain("WITH_DIMENSION");
  });
});
