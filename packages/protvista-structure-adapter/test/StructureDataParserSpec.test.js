import {
  getAllFeatureStructures,
  mergeOverlappingIntervals
} from "../src/StructureDataParser";
import { getEntryTestData } from "./UniProtEntryData";

describe("StructureDataParser", () => {
  it("should turn structures into features", () => {
    const entryData = getEntryTestData();
    const features = getAllFeatureStructures(entryData);
    expect(features).toMatchSnapshot();
  });

  it("should merge Overlapping Intervals", () => {
    const entryData = getEntryTestData();
    const features = getAllFeatureStructures(entryData);
    const overlapping = mergeOverlappingIntervals(features);
    expect(overlapping).toMatchSnapshot();
  });
});
