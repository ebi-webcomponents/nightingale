import parseScaleRange from "../src/utils/ColorScaleParser";

describe("color range parsing", () => {
  test("parseColorRange is a function", () => {
    expect(typeof parseScaleRange).toEqual("function");
  });
  test("empty call toparseColorRange", () => {
    const colorScale = parseScaleRange();
    expect(typeof colorScale).toEqual(typeof {});
    expect(colorScale).toHaveProperty("range");
    expect(colorScale).toHaveProperty("domain");
    expect(colorScale.range).toEqual([]);
    expect(colorScale.domain).toEqual([]);
  });
  test("call to parseColorRange with empty string", () => {
    const colorScale = parseScaleRange("");
    expect(typeof colorScale).toEqual(typeof {});
    expect(colorScale).toHaveProperty("range");
    expect(colorScale).toHaveProperty("domain");
    expect(colorScale.range).toEqual([]);
    expect(colorScale.domain).toEqual([]);
  });
  test("Should not create a scale with a single point", () => {
    const fn = () => parseScaleRange("#ffdd00:-2");
    expect(fn).toThrow();
  });
  test("Should not create a scale with only colors", () => {
    const fn = () => parseScaleRange("#ffdd00,#ffddff");
    expect(fn).toThrow();
  });
  test("Should not create a scale with only numbers", () => {
    const fn = () => parseScaleRange("4,5");
    expect(fn).toThrow();
  });
  test("Should not create a scale not valid colors", () => {
    const fn = () => parseScaleRange("badred:4,red5");
    expect(fn).toThrow();
    const fn2 = () => parseScaleRange("red:4,badred5");
    expect(fn2).toThrow();
  });
  test("parsing a valid 2 points string", () => {
    const colorScale = parseScaleRange("#ffdd00:-2,#0000FF:2");
    expect(colorScale.range.length).toEqual(2);
    expect(colorScale.domain.length).toEqual(2);
    expect(colorScale.range).toEqual(["#FFDD00", "#0000FF"]);
    expect(colorScale.domain).toEqual([-2, 2]);
  });
  test("parsing a valid 2 points string that uses named colors", () => {
    const colorScale = parseScaleRange("red:-2,lightblue:2");
    expect(colorScale.range.length).toEqual(2);
    expect(colorScale.domain.length).toEqual(2);
    expect(colorScale.range).toEqual(["RED", "LIGHTBLUE"]);
    expect(colorScale.domain).toEqual([-2, 2]);
  });
});
