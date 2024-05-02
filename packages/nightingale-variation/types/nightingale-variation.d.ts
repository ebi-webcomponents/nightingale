export type VariationDatum = {
  accession: string;
  variant: string;
  start: number;
  size?: number;
  xrefNames: string[];
  hasPredictions: boolean;
  tooltipContent?: string;
  protvistaFeatureId: string;
  alternativeSequence?: string;
  internalId?: string;
  wildType?: string;
  color?: string;
};

export type VariationData = {
  sequence: string;
  variants: VariationDatum[];
};

export type ProcessedVariationData = {
  type: string;
  normal: string;
  pos: number;
  variants: VariationDatum[];
};
