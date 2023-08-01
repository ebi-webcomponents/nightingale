import * as fs from "fs";
import { parseLinks, contactObjectToLinkList } from "../src/links-parser";

let data = "???";
describe("links parser", () => {
  beforeAll(() => {
    data = fs.readFileSync(`${__dirname}/example.tsv`, "utf8");
  });
  test("can parse commutative", () => {
    const obj = parseLinks(data, 0, 0.8);
    expect(obj).toHaveProperty("contacts");
    for (const [from, tos] of Object.entries(obj.contacts)) {
      for (const to of tos) {
        expect(obj.contacts[to]).toBeDefined();
        expect(obj.contacts[to].has(+from)).toBe(true);
      }
    }
  });
  test("can get a link list", () => {
    const obj = parseLinks(data, 0, 0.9999);
    const links = contactObjectToLinkList(obj.contacts);
    expect(links.length).toBeGreaterThan(0);
    for (const [a0, a1] of links) {
      expect(
        links.filter(
          ([b0, b1]) => (a0 === b0 && a1 === b1) || (a0 === b1 && a1 === b0),
        ).length,
      ).toBe(1);
    }
  });
});
