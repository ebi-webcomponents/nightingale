import NightingaleBaseElement, { withZoom, withDimensions } from "../src/index";
import Registry from "../src/registryWith";

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
    expect(element.implements).toEqual([Registry.withDimensions]);
    expect(element.dependencies).toEqual([]);
  });

  test("fails creating nightingale-with-zoom witouth dimensions", () => {
    expect(() => {
      const ElementWithZoom = withZoom(NightingaleBaseElement);
      window.customElements.define("with-zoom-element", ElementWithZoom);
      // eslint-disable-next-line no-new
      new ElementWithZoom();
    }).toThrow("Dependency error");
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
    expect(element.implements).toContain(Registry.withZoom);
    expect(element.implements).toContain(Registry.withDimensions);
    expect(element.dependencies).toContain(Registry.withDimensions);
  });
});
