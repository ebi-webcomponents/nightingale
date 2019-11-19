import { renameProperties, formatTooltip } from "../src/BasicHelper";

const feature = {
  type: "SIGNAL",
  category: "MOLECULE_PROCESSING",
  description: "",
  begin: "1",
  end: "17",
  evidences: [
    {
      code: "ECO:0000269",
      source: {
        name: "PubMed",
        id: "12665801",
        url: "http://www.ncbi.nlm.nih.gov/pubmed/12665801",
        alternativeUrl: "https://europepmc.org/abstract/MED/12665801"
      }
    }
  ]
};

describe("ProtvistaFeatureAdapter tests", () => {
  it("should correctly rename feature attributes", () => {
    const features = [{ begin: 1 }, { begin: 23 }];
    const renamedFeatures = renameProperties(features);
    expect(renamedFeatures).toEqual([
      { begin: 1, start: 1 },
      { begin: 23, start: 23 }
    ]);
  });

  it("should generate the correct tooltip data", () => {
    const tooltip = formatTooltip(feature);
    expect(tooltip).toMatchSnapshot();
  });
});
