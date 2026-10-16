import { amColorScale } from "../src/index";

describe("amColorScale", () => {
  test("colours AlphaMissense scores as 5.x did", () => {
    expect(amColorScale(0)).toBe("rgb(33, 102, 172)");
    expect(amColorScale(0.4527)).toBe("rgb(226, 226, 226)");
    expect(amColorScale(1)).toBe("rgb(178, 24, 43)");
    // Between checkpoints, colours are interpolated.
    expect(amColorScale(0.5)).toBe("rgb(230, 219, 212)");
  });
});
