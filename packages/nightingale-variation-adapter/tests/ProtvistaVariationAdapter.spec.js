import { transformData } from "../src/nightingale-variation-adapter";
import variants from "./variants.json";
import {
  getDiseaseAssociations,
  getDescriptions,
  getPopulationFrequencies,
  getPredictions,
} from "../src/tooltipGenerators";

describe("NightingaleVariationAdapter", () => {
  it("should format disease associations", () => {
    const { features } = variants;
    const associations = getDiseaseAssociations(features[0].association);
    expect(associations).toMatchSnapshot();
  });

  it("should format descriptions", () => {
    const { features } = variants;
    const descriptions = getDescriptions(features[0].descriptions);
    expect(descriptions).toMatchSnapshot();
  });

  it("should format population frequencies", () => {
    const { features } = variants;
    const frequencies = getPopulationFrequencies(
      features[0].populationFrequencies
    );
    expect(frequencies).toMatchSnapshot();
  });

  it("should format predictions", () => {
    const { features } = variants;
    const predictions = getPredictions(features[0].predictions);
    expect(predictions).toMatchSnapshot();
  });

  it("should transform the data adequately", () => {
    const data = transformData(variants);
    expect(data).toMatchSnapshot();
  });
});
