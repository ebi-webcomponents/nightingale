declare module "protvista-variation";

export type ProtvistaVariationDatum = {
  accession: string;
  variant: string;
  start: string;
  xrefNames: string[];
  hasPredictions: boolean;
  tooltipContent: string;
  protvistaFeatureId: string;
};

export type ProtvistaVariationData = {
  sequence: string;
  variants: ProtvistaVariationDatum[];
};
