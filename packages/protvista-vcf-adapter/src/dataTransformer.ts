import { ProtvistaVariationData } from "protvista-variation";
import { SourceType } from "protvista-variation-adapter/dist/es/variants";
import { VCFJSON } from "vcftojson/dist/types";

const transformData = (
  vcfData: VCFJSON[],
  accession: string,
  sequence: string
): ProtvistaVariationData => {
  return {
    sequence,
    variants: vcfData
      .map((vcfItem) => {
        const matchingTranscript = vcfItem.vep?.transcript_consequences.find(
          ({ swissprot, trembl }) =>
            (swissprot && swissprot.includes(accession)) ||
            (trembl && trembl.includes(accession))
        );
        if (matchingTranscript) {
          const [wt, change] = matchingTranscript.amino_acids?.split("/");
          return {
            accession: vcfItem.id,
            variant: change,
            start: matchingTranscript.protein_start.toString(),
            begin: matchingTranscript.protein_start.toString(),
            end: matchingTranscript.protein_end.toString(),
            type: "variant",
            cytogeneticBand: "",
            genomicLocation: "",
            locations: [],
            consequenceType: "",
            xrefs: [],
            wildType: wt,
            somaticStatus: 0,
            sourceType: SourceType.LargeScaleStudy,
            xrefNames: [],
            hasPredictions: false,
            tooltipContent: "",
            protvistaFeatureId: vcfItem.id,
          };
        } // TODO handle else
        return null;
      })
      .filter((variant) => variant),
  };
};

export default transformData;
