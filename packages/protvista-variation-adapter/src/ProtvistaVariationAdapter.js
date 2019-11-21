import ProtvistaFeatureAdapter from "protvista-feature-adapter";

import { getColor } from "./filters";
import formatTooltip from "./tooltipGenerators";

const getSourceType = (xrefs, sourceType) => {
  const xrefNames = xrefs.map(ref => ref.name);
  if (sourceType === "uniprot" || sourceType === "mixed") {
    xrefNames.push("uniprot");
  }
  return xrefNames;
};

export const transformData = data => {
  const { sequence, features } = data;
  const variants = features.map(variant => ({
    type: "Variant",
    accession: variant.genomicLocation,
    variant: variant.alternativeSequence,
    start: variant.begin,
    end: variant.end,
    tooltipContent: formatTooltip(variant),
    color: getColor(variant),
    association: variant.association,
    sourceType: variant.sourceType,
    xrefNames: getSourceType(variant.xrefs, variant.sourceType),
    clinicalSignificances: variant.clinicalSignificances,
    polyphenScore: variant.polyphenScore,
    siftScore: variant.siftScore
  }));
  if (!variants) return null;
  return { sequence, variants };
};

class ProtvistaVariationAdapter extends ProtvistaFeatureAdapter {
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

  parseEntry(data) {
    this._adaptedData = transformData(data);
  }

  _fireEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        cancelable: true
      })
    );
  }
}

export default ProtvistaVariationAdapter;
