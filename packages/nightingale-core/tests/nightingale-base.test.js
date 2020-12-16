import NightingaleBaseElement, { withZoom, withDimensions } from "../src/index";

describe("nightingale-base-element", () => {
  test("base element without dependencies", () => {
    window.customElements.define(
      "nightingale-base-element",
      NightingaleBaseElement
    );
    // expect(
    //   element
    // ).toBeInstanceOf(HTMLElement);
  });
});
