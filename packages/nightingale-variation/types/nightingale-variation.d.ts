export type NightingaleVariationDatum = {
  accession: string;
  variant: string;
  start: string;
  xrefNames: string[];
  hasPredictions: boolean;
  tooltipContent?: string;
  protvistaFeatureId: string;
};

export type NightingaleVariationData = {
  sequence: string;
  variants: NightingaleVariationDatum[];
};
