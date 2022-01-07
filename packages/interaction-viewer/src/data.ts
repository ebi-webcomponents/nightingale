export type Interaction = {
  accession1: string;
  accession2: string;
  gene?: string;
  interactor1: string;
  interactor2: string;
  organismDiffer?: boolean;
  experiments?: number;
  chain2?: string;
  chain1?: string;
};

export type DbReference = {
  type: string;
  id: string;
};

export type Source = {
  name: string;
  id: string;
  url: string;
  alternativeUrl?: string;
};

export type Evidence = {
  code: string;
  source?: Source;
};

export type Disease = {
  type?: string;
  text?: Text[];
  diseaseId: string;
  acronym?: string;
  dbReference?: DbReference;
  description?: Comment;
};

export type Comment = {
  value: string;
  evidences?: Evidence[];
};

export type Location = {
  location: Comment;
  topology?: Comment;
};

export type SubcellularLocation = {
  type?: string;
  locations: Location[];
  text?: Text[];
  molecule?: string;
};

export type APIInteractionData = {
  accession: string;
  name: string;
  proteinExistence: string;
  taxonomy: number;
  interactions?: Interaction[];
  diseases?: Disease[];
  subcellularLocations?: SubcellularLocation[];
  filterTerms?: string[];
};
