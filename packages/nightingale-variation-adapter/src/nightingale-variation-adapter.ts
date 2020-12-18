import NightingaleFeatureAdapter from "@nightingale-elements/nightingale-feature-adapter";
import { NightingaleVariationData } from "@nightingale-elements/nightingale-variation";
import { v1 } from "uuid";

import formatTooltip from "./tooltipGenerators";
import { ProteinsAPIVariation, Xref, SourceType } from "./variants";

const getSourceType = (xrefs: Xref[], sourceType: SourceType) => {
  const xrefNames = xrefs ? xrefs.map((ref) => ref.name) : [];
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = (
  data: ProteinsAPIVariation
): NightingaleVariationData => {
  const { sequence, features } = data;
  const variants = features.map((variant) => ({
    ...variant,
    accession: variant.genomicLocation,
    variant: variant.alternativeSequence ? variant.alternativeSequence : "-",
    start: variant.begin,
    xrefNames: getSourceType(variant.xrefs, variant.sourceType),
    hasPredictions: variant.predictions && variant.predictions.length > 0,
    tooltipContent: formatTooltip(variant),
    protvistaFeatureId: v1(),
  }));
  if (!variants) return null;
  return { sequence, variants };
};

class NightingaleVariationAdapter extends NightingaleFeatureAdapter {
  static is = "nightingale-variation-adapter";

  connectedCallback(): void {
    super.connectedCallback();
    if (this.closest("nightingale-manager")) {
      this.manager = this.closest("nightingale-manager");
      this.manager.register(this);
    }
  }

  disconnectedCallback(): void {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  parseEntry(data: ProteinsAPIVariation): void {
    this._adaptedData = transformData(data);
  }
}

export default NightingaleVariationAdapter;
