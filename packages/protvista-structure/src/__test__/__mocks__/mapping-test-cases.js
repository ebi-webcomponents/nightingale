import mappings from "./mappings";

const testCases = [
  {
    entry: "1AAP",
    pdb: {
      start: undefined,
      end: undefined,
    },
    uniprot: {
      start: undefined,
      end: undefined,
    },
    mappings: [],
    error: "Invalid start, end coordinates",
  },
  {
    entry: "1AAP",
    pdb: {
      start: 49,
      end: 53,
    },
    uniprot: {
      start: 335,
      end: 339,
    },
    error: "Mismatch between protein sequence and structure residues",
    mappings: mappings.mismatch,
  },
  {
    entry: "1AAP",
    pdb: {
      start: 0,
      end: 59,
    },
    uniprot: {
      start: 286,
      end: 345,
    },
    error: "Start or end coordinate outside of mapping range",
    mappings: mappings["1AAP"],
  },
  {
    entry: "1AAP",
    pdb: {
      start: 10,
      end: 100,
    },
    uniprot: {
      start: 10,
      end: 100,
    },
    error: "Start or end coordinate outside of mapping range",
    mappings: mappings.different_chains,
  },
  {
    entry: "1AAP",
    pdb: {
      start: 49,
      end: 53,
    },
    uniprot: {
      start: 335,
      end: 339,
    },
    mappings: mappings["1AAP"],
  },
  {
    entry: "1OWT",
    pdb: {
      start: 66,
      end: 66,
    },
    uniprot: {
      start: 189,
      end: 189,
    },
    mappings: mappings["1OWT"],
  },
  {
    entry: "102L",
    pdb: {
      start: 37,
      end: 43,
    },
    uniprot: {
      start: 37,
      end: 42,
    },
    mappings: mappings["102L"],
  },
];

export default testCases;
