import { transformData } from "../src/protvista-variation-adapter";
import variants from "./variants.json";
import {
  getDiseaseAssociations,
  getDescriptions,
  getPopulationFrequencies,
  getPredictions,
  getEnsemblCovidLinks,
} from "../src/tooltipGenerators";

describe("ProtvistaVariationAdapter", () => {
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

  it("should generate the Ensembl covid link only if present", () => {
    const { features } = variants;
    let data = getEnsemblCovidLinks(features[0]);
    expect(data).toMatchSnapshot();
    data = getEnsemblCovidLinks(features[1]);
    expect(data).toMatchSnapshot();
  });
});
