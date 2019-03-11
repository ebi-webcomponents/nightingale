import Region from "./Region";

describe("region coding and decoding", () => {
  test("empty region", () => {
    const region = new Region();
    expect(region.segments).toEqual([]);
    expect(region.max).toEqual(Infinity);
    expect(region.min).toEqual(-Infinity);
  });
  test("decode simple region", () => {
    const region = new Region();
    region.decode("1-5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
  });
  test("decode multiple region", () => {
    const region = new Region();
    region.decode("1-5,10-15");
    expect(region.segments.length).toEqual(2);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[1].start).toEqual(10);
    expect(region.segments[1].end).toEqual(15);
  });
});
