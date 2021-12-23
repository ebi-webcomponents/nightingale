import { v1 } from "uuid";
import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { ProtvistaVariationDatum } from "protvista-variation";

import {
  ProteinsAPIVariation,
  Xref,
  SourceType,
  Variant,
  AminoAcid,
} from "./variants";

export type TransformedVariant = ProtvistaVariationDatum & Variant;

const getSourceType = (xrefs: Xref[], sourceType: SourceType) => {
  const xrefNames = xrefs ? xrefs.map((ref) => ref.name) : [];
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = (
  data: ProteinsAPIVariation
): {
  sequence: string;
  variants: TransformedVariant[];
} => {
  const { sequence, features } = data;
  const variants = features.map((variant) => ({
    ...variant,
    accession: variant.genomicLocation,
    variant: variant.alternativeSequence
      ? variant.alternativeSequence
      : AminoAcid.Empty,
    start: variant.begin,
    xrefNames: getSourceType(variant.xrefs, variant.sourceType),
    hasPredictions: variant.predictions && variant.predictions.length > 0,
    data: variant,
    protvistaFeatureId: v1(),
  }));
  if (!variants) return null;
  return { sequence, variants };
};

class ProtvistaVariationAdapter extends ProtvistaFeatureAdapter<
  {
    sequence: string;
    variants: TransformedVariant[];
  },
  ProteinsAPIVariation
> {
  static get is(): string {
    return "protvista-variation-adapter";
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
  }

  disconnectedCallback(): void {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  // parseEntry(data: ProteinsAPIVariation): void {
  //   this._adaptedData = transformData(data);
  // }
}

export default ProtvistaVariationAdapter;
