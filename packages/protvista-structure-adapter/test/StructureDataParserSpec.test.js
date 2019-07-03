import StructureDataParser from "../src/StructureDataParser";
import { getEntryTestData } from "./UniProtEntryData";

describe("StructureDataParser", () => {
  it("should pass", () => {
    expect(true).toEqual(true);
  });

  it("should create a parser", () => {
    const aParser = new StructureDataParser();
    expect(aParser).toBeInstanceOf(StructureDataParser);
  });

  it("should parse mocked data", () => {
    const aParser = new StructureDataParser("P01234");
    const entryData = getEntryTestData();
    aParser.parseEntry(entryData);
    expect(JSON.stringify(aParser.pdbFeatures)).toMatchSnapshot();
  });
});
