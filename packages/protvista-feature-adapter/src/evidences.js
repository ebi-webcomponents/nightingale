const ecoMap = [
  {
    name: "ECO:0000269",
    description: "Manual assertion based on experiment",
    shortDescription: "Publication",
    acronym: "EXP",
    isManual: true,
  },
  {
    name: "ECO:0000303",
    description: "Manual assertion based on opinion",
    shortDescription: "Publication",
    acronym: "NAS",
    isManual: true,
  },
  {
    name: "ECO:0000305",
    description: "Manual assertion inferred by curator",
    shortDescription: "Curated",
    acronym: "IC",
    isManual: true,
  },
  {
    name: "ECO:0000250",
    description: "Manual assertion inferred from sequence similarity",
    shortDescription: "By similarity",
    acronym: "ISS",
    isManual: true,
  },
  {
    name: "ECO:0000255",
    description: "Manual assertion according to rules",
    shortDescription: "Sequence Analysis",
    acronym: "ISM",
    isManual: true,
  },
  {
    name: "ECO:0007744",
    description:
      "Manual assertion inferred from combination of experimental and computational evidence",
    shortDescription: "Combined sources",
    acronym: "MIXM",
    isManual: true,
  },
  {
    name: "ECO:0000312",
    description: "Manual assertion inferred from database entries",
    shortDescription: "Imported",
    acronym: "MI",
    isManual: true,
  },
  {
    name: "ECO:0000256",
    description: "Automatic assertion according to rules",
    shortDescription: "Automatic annotation",
    acronym: "AA",
  },
  {
    name: "ECO:0000259",
    description: "Automatic assertion inferred from signature match",
    shortDescription: "Automatic annotation",
    acronym: "AA",
  },
  {
    name: "ECO:0007829",
    description:
      "Automatic assertion inferred from combination of experimental and computational evidence",
    shortDescription: "Combined sources",
    acronym: "MIXA",
  },
  /* ECO:0007829 replaced ECO:0000213 from release 2022_02. 
  Some evidences still have the obsolete code. eg: https://www.ebi.ac.uk/proteins/api/antigen/P49841
  It is better to show the evidence rather than being it empty */
  {
    name: "ECO:0000213",
    description:
      "Automatic assertion inferred from combination of experimental and computational evidence",
    shortDescription: "Combined sources",
    acronym: "MIXA",
  },
  // ECO:0007744 replaced ECO:0000244 from release 2022_02. Same as above
  {
    name: "ECO:0000244",
    description:
      "Manual assertion inferred from combination of experimental and computational evidence",
    shortDescription: "Combined sources",
    acronym: "MIXM",
    isManual: true,
  },
  {
    name: "ECO:0000313",
    description: "Automatic assertion inferred from database entries",
    shortDescription: "Imported",
    acronym: "AI",
  },
  {
    name: "ECO:0000260",
    description: "Manual assertion inferred from signature match",
    shortDescription: "InterPro annotation",
    acronym: "SGNM",
    isManual: true,
  },
];

export default ecoMap;
