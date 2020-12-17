import { ProtvistaTrackDatum } from "protvista-track";

export interface FeaturesAPI {
  accession: string;
  entryName: string;
  sequence: string;
  sequenceChecksum: string;
  taxid: number;
  features: APIFeature[];
}

export interface APIFeature {
  type: string;
  category: string;
  description?: string;
  begin: string;
  end: string;
  molecule: string;
  evidences?: Evidence[];
  ftId?: string;
  alternativeSequence?: string;
}

export interface Evidence {
  code: string;
  source?: Source;
}

export interface Source {
  name: string;
  id: string;
  url: string;
  alternativeUrl?: string;
}

// renameProperties,
export declare const formatTooltip: (feature: APIFeature) => string;
export declare const getEvidenceFromCodes: (evidences: Evidence[]) => string;
export declare const formatXrefs: (xrefs: any) => string;

export declare const transformData: (
  data: APIFeature[]
) => (ProtvistaTrackDatum & APIFeature)[];

declare class ProtvistaFeatureAdapter extends HTMLElement {
  manager: any;

  data: any;

  _adaptedData: any;

  connectedCallback(): void;

  disconnectedCallback(): void;

  parseEntry(data: any): void;
}

export default ProtvistaFeatureAdapter;
