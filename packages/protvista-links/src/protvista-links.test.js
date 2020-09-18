import linksParser from "./links-parser";
import fs from "fs";

let data = "???";
describe("links parser", () => {
  beforeAll(() => {
    data = fs.readFileSync(`${__dirname}/example.tsv`, "utf8");
  });
  test("can parse", () => {
    const obj = linksParser(data, 0.8);
    expect(obj).toHaveProperty("links");
    expect(obj.links.flat().length).toBe(
      obj.links.reduce((agg, v) => agg + v.length, 0)
    );
    expect(obj.links.flat().length).toBe(new Set(obj.links.flat()).size);
    // console.log(obj.links);
  });
});
