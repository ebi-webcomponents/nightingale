type DbReference = {
  type: string;
  id: string;
  properties: Record<string, string>;
};

type Sequence = {
  version: number;
  length: number;
  mass: number;
  modified: string;
  sequence: string;
};

export type UniProtkbEntry = {
  accession: string;
  id: string;
  dbReferences: DbReference[];
  sequence: Sequence;
};
