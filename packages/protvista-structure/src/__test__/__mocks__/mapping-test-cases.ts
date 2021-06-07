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
];

export default testCases;
