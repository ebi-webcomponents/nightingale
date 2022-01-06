declare module namespace {
  export interface Interaction {
    accession1: string;
    accession2: string;
    gene: string;
    interactor1: string;
    interactor2: string;
    organismDiffer: boolean;
    experiments: number;
    chain2: string;
    chain1: string;
  }

  export interface Text {
    value: string;
  }

  export interface DbReference {
    type: string;
    id: string;
  }

  export interface Source {
    name: string;
    id: string;
    url: string;
    alternativeUrl: string;
  }

  export interface Evidence {
    code: string;
    source: Source;
  }

  export interface Description {
    value: string;
    evidences: Evidence[];
  }

  export interface Disease {
    type: string;
    text: Text[];
    diseaseId: string;
    acronym: string;
    dbReference: DbReference;
    description: Description;
  }

  export interface Source2 {
    name: string;
    id: string;
    url: string;
    alternativeUrl: string;
  }

  export interface Evidence2 {
    code: string;
    source: Source2;
  }

  export interface Location2 {
    value: string;
    evidences: Evidence2[];
  }

  export interface Source3 {
    name: string;
    id: string;
    url: string;
    alternativeUrl: string;
  }

  export interface Evidence3 {
    code: string;
    source: Source3;
  }

  export interface Topology {
    value: string;
    evidences: Evidence3[];
  }

  export interface Location {
    location: Location2;
    topology: Topology;
  }

  export interface Source4 {
    name: string;
    id: string;
    url: string;
    alternativeUrl: string;
  }

  export interface Evidence4 {
    code: string;
    source: Source4;
  }

  export interface Text2 {
    value: string;
    evidences: Evidence4[];
  }

  export interface SubcellularLocation {
    type: string;
    locations: Location[];
    text: Text2[];
    molecule: string;
  }

  export interface RootObject {
    accession: string;
    name: string;
    proteinExistence: string;
    taxonomy: number;
    interactions: Interaction[];
    diseases: Disease[];
    subcellularLocations: SubcellularLocation[];
  }
}
