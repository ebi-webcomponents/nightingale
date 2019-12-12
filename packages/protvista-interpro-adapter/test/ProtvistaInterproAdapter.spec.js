import { transformData } from "../src/ProtvistaInterproAdapter";

const payload = {
  count: 18,
  next: null,
  previous: null,
  results: [
    {
      metadata: {
        accession: "IPR002223",
        name: "Pancreatic trypsin inhibitor Kunitz domain",
        source_database: "interpro",
        type: "domain",
        integrated: null,
        member_databases: {
          prints: {
            PR00759: "BASICPTASE"
          },
          smart: {
            SM00131: "BPTI/Kunitz family of serine protease inhibitors."
          },
          pfam: {
            PF00014: "Kunitz/Bovine pancreatic trypsin inhibitor domain"
          },
          profile: {
            PS50279: "Pancreatic trypsin inhibitor (Kunitz) family profile"
          },
          cdd: {
            cd00109:
              "BPTI/Kunitz family of serine protease inhibitors; Structure is a disulfide ri..."
          }
        },
        go_terms: [
          {
            identifier: "GO:0004867",
            name: "serine-type endopeptidase inhibitor activity",
            category: {
              code: "F",
              name: "molecular_function"
            }
          }
        ]
      },
      proteins: [
        {
          accession: "p05067",
          protein_length: 770,
          source_database: "reviewed",
          organism: "9606",
          entry_protein_locations: [
            {
              model_acc: null,
              fragments: [
                {
                  start: 288,
                  end: 342,
                  "dc-status": "CONTINUOUS"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

describe("ProtvistaFeatureAdapter tests", () => {
  it("should transform the data correctly", () => {
    const transformedData = transformData(payload);
    expect(transformedData).toMatchSnapshot();
  });
});
