/* eslint-disable no-empty */
/* eslint-disable no-undef */
import Region from "../src/utils/Region";

describe("region encoding", () => {
  test("encode empty region", () => {
    const region = new Region();
    expect(region.segments).toEqual([]);
    expect(region.encode(true)).toEqual("");
    expect(region.encode(false)).toEqual("");
  });
  test("encode whole region", () => {
    const region = new Region();
    region.decode(":");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("-Infinity:Infinity");
    expect(region.encode(false)).toEqual(":");
  });
  test("encode simple region", () => {
    const region = new Region();
    region.decode("2:10");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("2:10");
    expect(region.encode(false)).toEqual("2:10");
  });
  test("encode multiple region", () => {
    const region = new Region({ min: 1, max: 100 });
    const txt = "1:5,10:20,30:50,50:100";
    region.decode(txt);
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual(txt);
    expect(region.encode()).toEqual(":5,10:20,30:50,50:");
  });
  test("encode multiple and complex region", () => {
    const region = new Region({ min: 1, max: 100 });
    region.decode(":,:20,30:,50:100,,0:200");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("1:100,1:20,30:100,50:100,1:100,1:100");
    expect(region.encode()).toEqual(":,:20,30:,50:,:,:");
  });
});

describe("region decoding", () => {
  test("empty region", () => {
    const region = new Region();
    expect(region.segments).toEqual([]);
    expect(region.max).toEqual(Infinity);
    expect(region.min).toEqual(-Infinity);

    region.decode(null);
    expect(region.segments).toEqual([]);
    region.decode();
    expect(region.segments).toEqual([]);
    region.decode(undefined);
    expect(region.segments).toEqual([]);
  });

  test("decode simple region", () => {
    const region = new Region();
    region.decode("1:5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
  });

  test("decode multiple region", () => {
    const region = new Region();
    region.decode("1:5,10:15");
    expect(region.segments.length).toEqual(2);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[1].start).toEqual(10);
    expect(region.segments[1].end).toEqual(15);
  });

  test("decode region missing start and not initialised min", () => {
    const region = new Region();
    region.decode(":5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(-Infinity);
    expect(region.segments[0].end).toEqual(5);
  });

  test("decode region missing end and not initialised max", () => {
    const region = new Region();
    region.decode("1:");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(Infinity);

    region.decode("1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(Infinity);
  });

  test("decode region missing start and initialised min", () => {
    const region = new Region({ min: 1, max: 10 });
    region.decode(":5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
  });

  test("decode region missing end and initialised max", () => {
    const region = new Region({ min: 1, max: 10 });
    region.decode("1:");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(10);

    region.decode("1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(10);
  });

  test("decode region with inverted values", () => {
    const region = new Region();
    region.decode("5:1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
  });

  test("Fails decoding because of non-numeric chars", () => {
    const region = new Region();
    try {
      region.decode("dasjk");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("1:dasjk");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("dasjk:3");
      fail("The decoding should fails");
    } catch (e) {}
  });

  test("Fails decoding because there should be at most 1 ':' per region", () => {
    const region = new Region();
    try {
      region.decode("1:3:4");
      fail("The decoding should fails");
    } catch (e) {}
  });
});
