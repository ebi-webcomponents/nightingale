import string2object from "../src/utils/String2Object";

describe("color range parsing", () => {
  test("parseColorRange is a function", () => {
    expect(typeof string2object).toEqual("function");
  });
  test("empty call string2object", () => {
    const obj = string2object();
    expect(typeof obj).toEqual(typeof {});
  });
  test("call to string2object with empty string", () => {
    const obj = string2object("");
    expect(typeof obj).toEqual(typeof {});
    expect(obj).toEqual({});
  });
  test("Should create an object with a single block", () => {
    const obj = string2object("key:value");
    expect(Object.keys(obj).length).toEqual(1);
    expect(obj).toHaveProperty("key");
    expect(obj.key).toEqual("value");
  });
  test("Should not create a scale without blocks KEY:VALUE", () => {
    const strings2parse = ["X", "X:Y,Z", "X:X,R,Y:Z", "X,Y:Z", "X:Y:Z"];
    strings2parse.forEach((str) => {
      const fn1 = () => string2object(str);
      expect(fn1).toThrow();
    });
  });
  test("parsing a valid 2 points string", () => {
    const obj = string2object("x:1,y:2");
    expect(Object.keys(obj).length).toEqual(2);
    expect(obj).toEqual({
      x: "1",
      y: "2",
    });
  });
  test("parsing a valid 2 points string and formatting keys", () => {
    const obj = string2object("x:1,y:2", {
      keyFormatter: (x) => x.toUpperCase(),
    });
    expect(Object.keys(obj).length).toEqual(2);
    expect(obj).toEqual({
      X: "1",
      Y: "2",
    });
  });
  test("parsing a valid 2 points string and formatting values", () => {
    const obj = string2object("x:1,y:2", {
      valueFormatter: (x: string) => parseFloat(x),
    });
    expect(Object.keys(obj).length).toEqual(2);
    expect(obj).toEqual({
      x: 1.0,
      y: 2.0,
    });
  });
});
