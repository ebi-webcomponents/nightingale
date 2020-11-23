import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { TransformedVariantsData } from "protvista-variation-adapter";
import { NightingaleElement } from "data-loader";
import { VCFData } from "../types/vcf.d.ts";
import {
  AminoAcid,
  ConsequenceType,
  FeatureType,
  SourceType,
} from "../../protvista-variation-adapter/dist/es/variants";

export const transformData = (vcfData: VCFData[]): TransformedVariantsData => {
  return {
    sequence: "ABCD",
    variants: vcfData.map((vcfItem) => ({
      accession: vcfItem.id,
      variant: "",
      start: vcfItem.start.toString(),
      begin: vcfItem.start.toString(),
      end: vcfItem.end.toString(),
      type: FeatureType.Variant,
      cytogeneticBand: "",
      genomicLocation: "",
      locations: [],
      consequenceType: ConsequenceType.Empty,
      xrefs: [],
      wildType: AminoAcid.A,
      somaticStatus: 0,
      sourceType: SourceType.LargeScaleStudy,
      xrefNames: [],
      hasPredictions: false,
      tooltipContent: "",
      protvistaFeatureId: vcfItem.id,
    })),
  };
};

class VCFAdapter extends ProtvistaFeatureAdapter implements NightingaleElement {
  connectedCallback() {
    super.connectedCallback();
  }

  parseEntry(data: VCFData[]) {
    this._adaptedData = transformData(data);
  }

  static get is() {
    return "vcf-adapter";
  }
}

export default VCFAdapter;
