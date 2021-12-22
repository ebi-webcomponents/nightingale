import { transformData } from "../src/protvista-feature-adapter";

const featureData = {
  accession: "P05067",
  features: [
    {
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
            alternativeUrl: "https://europepmc.org/abstract/MED/12665801",
          },
        },
      ],
    },
  ],
};

describe("ProtvistaFeatureAdapter tests", () => {
  it("should correctly transform data", () => {
    const transformedData = transformData(featureData);
    console.log(JSON.stringify(transformedData));
    expect(transformedData).toEqual([
      {
        accession: "P05067",
        start: "1",
        end: "17",
        type: "SIGNAL",
        data: {
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
                alternativeUrl: "https://europepmc.org/abstract/MED/12665801",
              },
            },
          ],
        },
        protvistaFeatureId: "uuid_id",
      },
    ]);
  });
});
