import {
  getAllFeatureStructures,
  mergeOverlappingIntervals,
} from "../src/structure-data-parser";
import entryStructureData from "./UniProtEntryData";

describe("StructureDataParser", () => {
  it("should turn structures into features", () => {
    const features = getAllFeatureStructures(entryStructureData);
    expect(features).toMatchSnapshot();
  });

  it("should merge Overlapping Intervals", () => {
    const features = getAllFeatureStructures(entryStructureData);
    const overlapping = mergeOverlappingIntervals(features);
    expect(overlapping).toMatchSnapshot();
  });
});
