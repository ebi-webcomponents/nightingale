import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { v1 } from "uuid";

import formatTooltip from "./tooltipGenerators";
import { NightingaleElement } from "../../data-loader/src/data-loader";
import { ProteinsAPIVariation } from "../types/variants";

const getSourceType = (xrefs, sourceType) => {
  const xrefNames = xrefs ? xrefs.map((ref) => ref.name) : [];
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = (data: ProteinsAPIVariation) => {
  const { sequence, features } = data;
  const variants = features.map((variant) => ({
    type: "Variant",
    accession: variant.genomicLocation,
    variant: variant.alternativeSequence,
    start: variant.begin,
    end: variant.end,
    tooltipContent: formatTooltip(variant),
    association: variant.association,
    sourceType: variant.sourceType,
    xrefNames: getSourceType(variant.xrefs, variant.sourceType),
    clinicalSignificances: variant.clinicalSignificances,
    polyphenScore: variant.polyphenScore,
    siftScore: variant.siftScore,
    protvistaFeatureId: v1(),
  }));
  if (!variants) return null;
  return { sequence, variants };
};

class ProtvistaVariationAdapter extends ProtvistaFeatureAdapter
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
