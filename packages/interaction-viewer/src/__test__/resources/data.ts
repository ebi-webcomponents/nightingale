import { APIInteractionData } from "../../data";

const data: APIInteractionData[] = [
  {
    accession: "Q8TD43",
    name: "TRPM4_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "Q8TD43",
        accession2: "P60903",
        gene: "S100A10",
        interactor1: "EBI-11723041",
        interactor2: "EBI-717048",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P31949",
        gene: "S100A11",
        interactor1: "EBI-11723041",
        interactor2: "EBI-701862",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P29034",
        gene: "S100A2",
        interactor1: "EBI-11723041",
        interactor2: "EBI-752230",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P33764",
        gene: "S100A3",
        interactor1: "EBI-11723041",
        interactor2: "EBI-1044747",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P26447",
        gene: "S100A4",
        interactor1: "EBI-11723041",
        interactor2: "EBI-717058",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P33763",
        gene: "S100A5",
        interactor1: "EBI-11723041",
        interactor2: "EBI-7211732",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "Q8TD43",
        accession2: "P06703",
        gene: "S100A6",
        interactor1: "EBI-11723041",
        interactor2: "EBI-352877",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43",
        accession2: "P05109",
        gene: "S100A8",
        interactor1: "EBI-11723041",
        interactor2: "EBI-355281",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "Q8TD43-1",
        accession2: "Q8TD43-1",
        gene: "TRPM4",
        interactor1: "EBI-20594601",
        interactor2: "EBI-20594601",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    diseases: [
      {
        type: "DISEASE",
        diseaseId: "Progressive familial heart block 1B",
        acronym: "PFHB1B",
        dbReference: {
          type: "MIM",
          id: "604559",
        },
        description: {
          value:
            "A cardiac bundle branch disorder characterized by progressive alteration of cardiac conduction through the His-Purkinje system, with a pattern of a right bundle-branch block and/or left anterior hemiblock occurring individually or together. It leads to complete atrio-ventricular block causing syncope and sudden death.",
          evidences: [
            {
              code: "ECO:0000269",
              source: {
                name: "PubMed",
                id: "19726882",
                url: "http://www.ncbi.nlm.nih.gov/pubmed/19726882",
                alternativeUrl: "https://europepmc.org/abstract/MED/19726882",
              },
            },
            {
              code: "ECO:0000269",
              source: {
                name: "PubMed",
                id: "20562447",
                url: "http://www.ncbi.nlm.nih.gov/pubmed/20562447",
                alternativeUrl: "https://europepmc.org/abstract/MED/20562447",
              },
            },
            {
              code: "ECO:0000269",
              source: {
                name: "PubMed",
                id: "21887725",
                url: "http://www.ncbi.nlm.nih.gov/pubmed/21887725",
                alternativeUrl: "https://europepmc.org/abstract/MED/21887725",
              },
            },
          ],
        },
        text: [
          {
            value:
              "The disease is caused by variants affecting the gene represented in this entry",
          },
        ],
      },
      {
        type: "DISEASE",
        diseaseId: "Erythrokeratodermia variabilis et progressiva 6",
        acronym: "EKVP6",
        dbReference: {
          type: "MIM",
          id: "618531",
        },
        description: {
          value:
            "A form of erythrokeratodermia variabilis et progressiva, a genodermatosis characterized by the coexistence of two independent skin lesions: transient erythema and hyperkeratosis that is usually localized but occasionally occurs in its generalized form. Clinical presentation varies significantly within a family and from one family to another. Palmoplantar keratoderma is present in around 50% of cases. EKVP6 inheritance is autosomal dominant.",
          evidences: [
            {
              code: "ECO:0000269",
              source: {
                name: "PubMed",
                id: "30528822",
                url: "http://www.ncbi.nlm.nih.gov/pubmed/30528822",
                alternativeUrl: "https://europepmc.org/abstract/MED/30528822",
              },
            },
          ],
        },
        text: [
          {
            value:
              "The disease is caused by variants affecting the gene represented in this entry",
          },
        ],
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        molecule: "Isoform 1",
        locations: [
          {
            location: {
              value: "Cell membrane",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "12015988",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/12015988",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/12015988",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "15331675",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/15331675",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/15331675",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "15590641",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/15590641",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/15590641",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29211723",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29211723",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29211723",
                  },
                },
              ],
            },
            topology: {
              value: "Multi-pass membrane protein",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29211723",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29211723",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29211723",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29217581",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29217581",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29217581",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Endoplasmic reticulum",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Golgi apparatus",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
              ],
            },
          },
        ],
      },
      {
        type: "SUBCELLULAR_LOCATION",
        molecule: "Isoform 2",
        locations: [
          {
            location: {
              value: "Cell membrane",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "11535825",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/11535825",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/11535825",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Endoplasmic reticulum",
            },
          },
          {
            location: {
              value: "Golgi apparatus",
            },
          },
        ],
      },
    ],
  },
  {
    accession: "P05109",
    name: "S10A8_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P05109",
        accession2: "P04406",
        gene: "GAPDH",
        interactor1: "EBI-355281",
        interactor2: "EBI-354056",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P05109",
        accession2: "P06702",
        gene: "S100A9",
        interactor1: "EBI-355281",
        interactor2: "EBI-1055001",
        organismDiffer: false,
        experiments: 7,
      },
      {
        accession1: "P05109",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-355281",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Secreted",
            },
          },
          {
            location: {
              value: "Cytoplasm",
            },
          },
          {
            location: {
              value: "Cytoplasm, cytoskeleton",
            },
          },
          {
            location: {
              value: "Cell membrane",
            },
            topology: {
              value: "Peripheral membrane protein",
            },
          },
        ],
        text: [
          {
            value:
              "Predominantly localized in the cytoplasm. Upon elevation of the intracellular calcium level, translocated from the cytoplasm to the cytoskeleton and the cell membrane. Upon neutrophil activation or endothelial adhesion of monocytes, is secreted via a microtubule-mediated, alternative pathway",
          },
        ],
      },
    ],
  },
  {
    accession: "Q8TD43-1",
    name: "TRPM4-1_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "Q8TD43-1",
        accession2: "Q8TD43-1",
        gene: "TRPM4",
        interactor1: "EBI-20594601",
        interactor2: "EBI-20594601",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Cell membrane",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "12015988",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/12015988",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/12015988",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "15331675",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/15331675",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/15331675",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "15590641",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/15590641",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/15590641",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29211723",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29211723",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29211723",
                  },
                },
              ],
            },
            topology: {
              value: "Multi-pass membrane protein",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29211723",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29211723",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29211723",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "29217581",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/29217581",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/29217581",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Endoplasmic reticulum",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Golgi apparatus",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "19945433",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/19945433",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/19945433",
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    accession: "P31949",
    name: "S10AB_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P31949",
        accession2: "Q96HA8",
        gene: "NTAQ1",
        interactor1: "EBI-701862",
        interactor2: "EBI-741158",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P31949",
        accession2: "P04271",
        gene: "S100B",
        interactor1: "EBI-701862",
        interactor2: "EBI-458391",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P31949",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-701862",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P31949",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-701862",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Cytoplasm",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "18618420",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/18618420",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/18618420",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Nucleus",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "18618420",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/18618420",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/18618420",
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    accession: "P29034",
    name: "S10A2_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P29034",
        accession2: "Q3SXY8",
        gene: "ARL13B",
        interactor1: "EBI-752230",
        interactor2: "EBI-11343438",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P29034",
        accession2: "P15311",
        gene: "EZR",
        interactor1: "EBI-752230",
        interactor2: "EBI-1056902",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "Q5JX71",
        gene: "FAM209A",
        interactor1: "EBI-752230",
        interactor2: "EBI-18304435",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P29034",
        accession2: "Q02790",
        gene: "FKBP4",
        interactor1: "EBI-752230",
        interactor2: "EBI-1047444",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P29034",
        accession2: "P52292",
        gene: "KPNA2",
        interactor1: "EBI-752230",
        interactor2: "EBI-349938",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P29034",
        accession2: "Q00987",
        gene: "MDM2",
        interactor1: "EBI-752230",
        interactor2: "EBI-389668",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "O15151",
        gene: "MDM4",
        interactor1: "EBI-752230",
        interactor2: "EBI-398437",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "P35579",
        gene: "MYH9",
        interactor1: "EBI-752230",
        interactor2: "EBI-350338",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "P23297",
        gene: "S100A1",
        interactor1: "EBI-752230",
        interactor2: "EBI-743686",
        organismDiffer: false,
        experiments: 7,
      },
      {
        accession1: "P29034",
        accession2: "P29034",
        gene: "S100A2",
        interactor1: "EBI-752230",
        interactor2: "EBI-752230",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P29034",
        accession2: "P33764",
        gene: "S100A3",
        interactor1: "EBI-752230",
        interactor2: "EBI-1044747",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P29034",
        accession2: "P04271",
        gene: "S100B",
        interactor1: "EBI-752230",
        interactor2: "EBI-458391",
        organismDiffer: false,
        experiments: 9,
      },
      {
        accession1: "P29034",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-752230",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 4,
      },
      {
        accession1: "P29034",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-752230",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "P52293",
        gene: "Kpna2",
        interactor1: "EBI-752230",
        interactor2: "EBI-3043908",
        organismDiffer: true,
        experiments: 2,
      },
      {
        accession1: "P29034",
        accession2: "P26882",
        gene: "PPID",
        interactor1: "EBI-752230",
        interactor2: "EBI-6477155",
        organismDiffer: true,
        experiments: 3,
      },
    ],
  },
  {
    accession: "P06703",
    name: "S10A6_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P06703",
        accession2: "Q9HB71",
        gene: "CACYBP",
        interactor1: "EBI-352877",
        interactor2: "EBI-1047302",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P06703",
        accession2: "O95684",
        gene: "CEP43",
        interactor1: "EBI-352877",
        interactor2: "EBI-1266334",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P06703",
        accession2: "B3EWG5",
        gene: "FAM25C",
        interactor1: "EBI-352877",
        interactor2: "EBI-14240149",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P06703",
        accession2: "Q02790",
        gene: "FKBP4",
        interactor1: "EBI-352877",
        interactor2: "EBI-1047444",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P06703",
        accession2: "P52292",
        gene: "KPNA2",
        interactor1: "EBI-352877",
        interactor2: "EBI-349938",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P06703",
        accession2: "Q00987",
        gene: "MDM2",
        interactor1: "EBI-352877",
        interactor2: "EBI-389668",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P06703",
        accession2: "P35579",
        gene: "MYH9",
        interactor1: "EBI-352877",
        interactor2: "EBI-350338",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P06703",
        accession2: "P50542",
        gene: "PEX5",
        interactor1: "EBI-352877",
        interactor2: "EBI-597835",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P06703",
        accession2: "P04271",
        gene: "S100B",
        interactor1: "EBI-352877",
        interactor2: "EBI-458391",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P06703",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-352877",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P06703",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-352877",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P06703",
        accession2: "P26882",
        gene: "PPID",
        interactor1: "EBI-352877",
        interactor2: "EBI-6477155",
        organismDiffer: true,
        experiments: 3,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Nucleus envelope",
            },
          },
          {
            location: {
              value: "Cytoplasm",
            },
          },
          {
            location: {
              value: "Cell membrane",
            },
            topology: {
              value: "Peripheral membrane protein",
            },
            orientation: {
              value: "Cytoplasmic side",
            },
          },
        ],
      },
    ],
  },
  {
    accession: "P60903",
    name: "S10AA_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P60903",
        accession2: "Q09666",
        gene: "AHNAK",
        interactor1: "EBI-717048",
        interactor2: "EBI-2555881",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P60903",
        accession2: "P07355",
        gene: "ANXA2",
        interactor1: "EBI-717048",
        interactor2: "EBI-352622",
        organismDiffer: false,
        experiments: 4,
      },
      {
        accession1: "P60903",
        accession2: "P46092",
        gene: "CCR10",
        interactor1: "EBI-717048",
        interactor2: "EBI-348022",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P60903",
        accession2: "Q14527",
        gene: "HLTF",
        interactor1: "EBI-717048",
        interactor2: "EBI-1045161",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P60903",
        accession2: "Q8NB16-2",
        gene: "MLKL",
        interactor1: "EBI-717048",
        interactor2: "EBI-19046912",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P60903",
        accession2: "P60321",
        gene: "NANOS2",
        interactor1: "EBI-717048",
        interactor2: "EBI-10216569",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P60903",
        accession2: "P33764",
        gene: "S100A3",
        interactor1: "EBI-717048",
        interactor2: "EBI-1044747",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P60903",
        accession2: "Q8WXG8",
        gene: "S100Z",
        interactor1: "EBI-717048",
        interactor2: "EBI-12198403",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P60903",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-717048",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P60903",
        accession2: "O75604",
        gene: "USP2",
        interactor1: "EBI-717048",
        interactor2: "EBI-743272",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P60903",
        accession2: "Q8N5A5-2",
        gene: "ZGPAT",
        interactor1: "EBI-717048",
        interactor2: "EBI-10183064",
        organismDiffer: false,
        experiments: 3,
      },
    ],
  },
  {
    accession: "P33763",
    name: "S10A5_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P33763",
        accession2: "Q9HB71",
        gene: "CACYBP",
        interactor1: "EBI-7211732",
        interactor2: "EBI-1047302",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P33763",
        accession2: "P52907",
        gene: "CAPZA1",
        interactor1: "EBI-7211732",
        interactor2: "EBI-355586",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33763",
        accession2: "O15151",
        gene: "MDM4",
        interactor1: "EBI-7211732",
        interactor2: "EBI-398437",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33763",
        accession2: "P35579",
        gene: "MYH9",
        interactor1: "EBI-7211732",
        interactor2: "EBI-350338",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33763",
        accession2: "P32418",
        gene: "SLC8A1",
        interactor1: "EBI-7211732",
        interactor2: "EBI-2682189",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33763",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-7211732",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33763",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-7211732",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 3,
      },
    ],
  },
  {
    accession: "P26447",
    name: "S10A4_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P26447",
        accession2: "P15514",
        gene: "AREG",
        interactor1: "EBI-717058",
        interactor2: "EBI-953674",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P26447",
        accession2: "P35070",
        gene: "BTC",
        interactor1: "EBI-717058",
        interactor2: "EBI-6590057",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P26447",
        accession2: "Q9HB71",
        gene: "CACYBP",
        interactor1: "EBI-717058",
        interactor2: "EBI-1047302",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P26447",
        accession2: "P00533",
        gene: "EGFR",
        interactor1: "EBI-717058",
        interactor2: "EBI-297353",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P26447",
        accession2: "P21860",
        gene: "ERBB3",
        interactor1: "EBI-717058",
        interactor2: "EBI-720706",
        organismDiffer: false,
        experiments: 4,
      },
      {
        accession1: "P26447",
        accession2: "Q15303",
        gene: "ERBB4",
        interactor1: "EBI-717058",
        interactor2: "EBI-80371",
        organismDiffer: false,
        experiments: 4,
      },
      {
        accession1: "P26447",
        accession2: "P15311",
        gene: "EZR",
        interactor1: "EBI-717058",
        interactor2: "EBI-1056902",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P26447",
        accession2: "Q00987",
        gene: "MDM2",
        interactor1: "EBI-717058",
        interactor2: "EBI-389668",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P26447",
        accession2: "P35579",
        gene: "MYH9",
        interactor1: "EBI-717058",
        interactor2: "EBI-350338",
        organismDiffer: false,
        experiments: 18,
      },
      {
        accession1: "P26447",
        accession2: "P23297",
        gene: "S100A1",
        interactor1: "EBI-717058",
        interactor2: "EBI-743686",
        organismDiffer: false,
        experiments: 4,
      },
      {
        accession1: "P26447",
        accession2: "P26447",
        gene: "S100A4",
        interactor1: "EBI-717058",
        interactor2: "EBI-717058",
        organismDiffer: false,
        experiments: 6,
      },
      {
        accession1: "P26447",
        accession2: "P04271",
        gene: "S100B",
        interactor1: "EBI-717058",
        interactor2: "EBI-458391",
        organismDiffer: false,
        experiments: 8,
      },
      {
        accession1: "P26447",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-717058",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 9,
      },
      {
        accession1: "P26447",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-717058",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Secreted",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "26654597",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/26654597",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/26654597",
                  },
                },
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "30713770",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/30713770",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/30713770",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Nucleus",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "23752197",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/23752197",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/23752197",
                  },
                },
              ],
            },
          },
          {
            location: {
              value: "Cytoplasm",
              evidences: [
                {
                  code: "ECO:0000250",
                  source: {
                    name: "UniProtKB",
                    id: "P07091",
                    url: "https://www.uniprot.org/uniprot/P07091",
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    accession: "P33764",
    name: "S10A3_HUMAN",
    proteinExistence: "Evidence at protein level",
    taxonomy: 9606,
    interactions: [
      {
        accession1: "P33764",
        accession2: "Q8TBB1",
        gene: "LNX1",
        interactor1: "EBI-1044747",
        interactor2: "EBI-739832",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P33764",
        accession2: "P23297",
        gene: "S100A1",
        interactor1: "EBI-1044747",
        interactor2: "EBI-743686",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P33764",
        accession2: "P60903",
        gene: "S100A10",
        interactor1: "EBI-1044747",
        interactor2: "EBI-717048",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P33764",
        accession2: "P29034",
        gene: "S100A2",
        interactor1: "EBI-1044747",
        interactor2: "EBI-752230",
        organismDiffer: false,
        experiments: 5,
      },
      {
        accession1: "P33764",
        accession2: "Q8WXG8",
        gene: "S100Z",
        interactor1: "EBI-1044747",
        interactor2: "EBI-12198403",
        organismDiffer: false,
        experiments: 3,
      },
      {
        accession1: "P33764",
        accession2: "P04637",
        gene: "TP53",
        interactor1: "EBI-1044747",
        interactor2: "EBI-366083",
        organismDiffer: false,
        experiments: 2,
      },
      {
        accession1: "P33764",
        accession2: "Q8TD43",
        gene: "TRPM4",
        interactor1: "EBI-1044747",
        interactor2: "EBI-11723041",
        organismDiffer: false,
        experiments: 2,
      },
    ],
    subcellularLocations: [
      {
        type: "SUBCELLULAR_LOCATION",
        locations: [
          {
            location: {
              value: "Cytoplasm",
              evidences: [
                {
                  code: "ECO:0000269",
                  source: {
                    name: "PubMed",
                    id: "18083705",
                    url: "http://www.ncbi.nlm.nih.gov/pubmed/18083705",
                    alternativeUrl:
                      "https://europepmc.org/abstract/MED/18083705",
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
];

export default data;
