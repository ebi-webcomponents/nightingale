import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { ProtvistaVariationData } from "protvista-variation";
import { v1 } from "uuid";
import { NightingaleElement } from "data-loader";

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
): ProtvistaVariationData => {
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

class ProtvistaVariationAdapter
  extends ProtvistaFeatureAdapter
  implements NightingaleElement {
  static get is() {
    return "protvista-variation-adapter";
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.closest("protvista-manager")) {
      this.manager = this.closest("protvista-manager");
      this.manager.register(this);
    }
  }

  disconnectedCallback() {
    if (this.manager) {
      this.manager.unregister(this);
    }
  }

  parseEntry(data: ProteinsAPIVariation) {
    this._adaptedData = transformData(data);
  }

  _fireEvent(name: string, detail: any) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        cancelable: true,
      })
    );
  }
}

export default ProtvistaVariationAdapter;
