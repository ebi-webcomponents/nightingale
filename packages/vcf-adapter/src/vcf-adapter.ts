import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { ProtvistaVariationData } from "protvista-variation";
import { NightingaleElement } from "data-loader";
import { vcfToJSON } from "vcftojson";
import { VCFJSON } from "vcftojson/dist/types";
import {
  AminoAcid,
  ConsequenceType,
  SourceType,
} from "../../protvista-variation-adapter/dist/es/variants";

export const transformData = (vcfData: VCFJSON[]): ProtvistaVariationData => {
  return {
    sequence: "ABCD",
    variants: vcfData.map((vcfItem) => ({
      accession: vcfItem.id,
      variant: "",
      start: "0",
      begin: "0",
      end: "0",
      // start: vcfItem.start.toString(),
      // begin: vcfItem.start.toString(),
      // end: vcfItem.end.toString(),
      type: "variant",
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
  connectedCallback(): void {
    super.connectedCallback();
  }

  parseEntry(data: string): ProtvistaVariationData {
    vcfToJSON(data, { runVEP: true }).then((vcfJson) => {
      return (this._adaptedData = transformData(vcfJson));
    });
    return null;
  }

  static get is(): string {
    return "vcf-adapter";
  }
}

export default VCFAdapter;
