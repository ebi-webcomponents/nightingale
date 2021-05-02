/* eslint-disable no-empty */
/* eslint-disable no-undef */
import Region from "./Region";

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
    expect(region.encode(true)).toEqual("-Infinity:Infinity:Default");
    expect(region.encode(false)).toEqual(":");
  });

  test("encode whole region with default color", () => {
    const region = new Region();
    region.decode("::");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("-Infinity:Infinity:Default");
    expect(region.encode(false)).toEqual(":");
  });
  test("encode simple region", () => {
    const region = new Region();
    region.decode("2:10");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("2:10:Default");
    expect(region.encode(false)).toEqual("2:10");
  });
  test("encode simple region with color", () => {
    const region = new Region();
    region.decode("2:10:#00EE55");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("2:10:#00EE55");
    expect(region.encode(false)).toEqual("2:10:#00EE55");
  });
  test("encode simple region with color alpha", () => {
    const region = new Region();
    region.decode("2:10:#00EE55A0");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("2:10:#00EE55A0");
    expect(region.encode(false)).toEqual("2:10:#00EE55A0");
  });
  test("encode whole region with color", () => {
    const region = new Region();
    region.decode("::#00EE55");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual("-Infinity:Infinity:#00EE55");
    expect(region.encode(false)).toEqual("::#00EE55");
  });
  test("encode multiple region", () => {
    const region = new Region({ min: 1, max: 100 });
    const txt = "1:5,10:20,30:50,50:100";
    region.decode(txt);
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual(
      "1:5:Default,10:20:Default,30:50:Default,50:100:Default"
    );
    expect(region.encode()).toEqual(":5,10:20,30:50,50:");
  });
  test("encode multiple region with color", () => {
    const region = new Region({ min: 1, max: 100 });
    const txt = "1:5:#00EE55,10:20,30:50:#00E800AA,50:100";
    region.decode(txt);
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual(
      "1:5:#00EE55,10:20:Default,30:50:#00E800AA,50:100:Default"
    );
    expect(region.encode()).toEqual(":5:#00EE55,10:20,30:50:#00E800AA,50:");
  });

  test("encode multiple and complex region", () => {
    const region = new Region({ min: 1, max: 100 });
    region.decode(":,:20,30:,50:100,,0:200");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual(
      "1:100:Default,1:20:Default,30:100:Default,50:100:Default,1:100:Default,1:100:Default"
    );
    expect(region.encode()).toEqual(":,:20,30:,50:,:,:");
  });

  test("encode multiple and complex region with color", () => {
    const region = new Region({ min: 1, max: 100 });
    region.decode("::#00EE55,:20:#00E800AA,30::#00EE55,50:100,,0:200");
    expect(region.segments).toMatchSnapshot();
    expect(region.encode(true)).toEqual(
      "1:100:#00EE55,1:20:#00E800AA,30:100:#00EE55,50:100:Default,1:100:Default,1:100:Default"
    );
    expect(region.encode()).toEqual(
      "::#00EE55,:20:#00E800AA,30::#00EE55,50:,:,:"
    );
  });
});

describe("region decoding", () => {
  test("empty region", () => {
    const region = new Region();
    expect(region.segments).toEqual([]);
    expect(region.max).toEqual(Infinity);
    expect(region.min).toEqual(-Infinity);
    expect(region.color).toEqual(undefined);

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
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode simple region with color", () => {
    const region = new Region();
    region.decode("1:5:#AAAAAA");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual("#AAAAAA");
  });

  test("decode multiple region", () => {
    const region = new Region();
    region.decode("1:5,10:15");
    expect(region.segments.length).toEqual(2);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual(undefined);
    expect(region.segments[1].start).toEqual(10);
    expect(region.segments[1].end).toEqual(15);
    expect(region.segments[1].color).toEqual(undefined);
  });

  test("decode multiple region with color", () => {
    const region = new Region();
    region.decode("1:5:#AAAAAA,10:15:#AAAAAA00");
    expect(region.segments.length).toEqual(2);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual("#AAAAAA");
    expect(region.segments[1].start).toEqual(10);
    expect(region.segments[1].end).toEqual(15);
    expect(region.segments[1].color).toEqual("#AAAAAA00");
  });

  test("decode region missing start and not initialised min", () => {
    const region = new Region();
    region.decode(":5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(-Infinity);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode region missing end and not initialised max", () => {
    const region = new Region();
    region.decode("1:");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(Infinity);
    expect(region.segments[0].color).toEqual(undefined);

    region.decode("1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(Infinity);
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode region missing start and initialised min", () => {
    const region = new Region({ min: 1, max: 10 });
    region.decode(":5");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode region missing end and initialised max", () => {
    const region = new Region({ min: 1, max: 10 });
    region.decode("1:");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(10);
    expect(region.segments[0].color).toEqual(undefined);

    region.decode("1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(10);
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode region with inverted values", () => {
    const region = new Region();
    region.decode("5:1");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual(undefined);
  });

  test("decode region with inverted values with color", () => {
    const region = new Region();
    region.decode("5:1:#000000");
    expect(region.segments.length).toEqual(1);
    expect(region.segments[0].start).toEqual(1);
    expect(region.segments[0].end).toEqual(5);
    expect(region.segments[0].color).toEqual("#000000");
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

  test("Fails decoding because there should be at most 2 ':' per region", () => {
    const region = new Region();
    try {
      region.decode("1:3:#000000:5");
      fail("The decoding should fails");
    } catch (e) {}
  });

  test("Fails decoding because of wrong color format", () => {
    const region = new Region();
    try {
      region.decode("2:10:#00ET5S");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("2:10:#000000000");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("2:10:aeghh");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("::dggS");
      fail("The decoding should fails");
    } catch (e) {}
    try {
      region.decode("::#000000II");
      fail("The decoding should fails");
    } catch (e) {}
  });
});
