/* eslint-disable no-param-reassign */
import { ProtvistaVariationDatum } from "protvista-variation";
import { SourceType } from "protvista-variation-adapter/dist/es/variants";
import { VCFJSON } from "vcftojson/dist/types";

export const JSONToHTML = (
  obj: any,
  level = 1,
  ignoreKeys?: string[]
): string => {
  if (typeof obj !== "object") {
    return `<span>${obj}</span>`;
  }
  return `<ul>${Object.entries(obj).reduce((accumulator, [key, value]) => {
    if (ignoreKeys?.includes(key)) {
      return accumulator;
    }
    if (Array.isArray(value)) {
      const reduced = `${value.reduce(
        (acc2, value2) => `${acc2}${JSONToHTML(value2, level++, ignoreKeys)}`,
        ""
      )}`;
      return `${accumulator}<li><strong>${key}</strong><span>${reduced}</span></li>`;
    }
    if (typeof value === "object") {
      return `${accumulator}<li><strong>${key}</strong><span>${JSONToHTML(
        value,
        level++,
        ignoreKeys
      )}</span></li>`;
    }
    return `${accumulator}<li><strong>${key}</strong><span>${value}</span></li>`;
  }, "")}</ul>`;
};

const transformData = (
  vcfData: VCFJSON[],
  accession: string
): ProtvistaVariationDatum[] => {
  return vcfData
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
          tooltipContent: JSONToHTML(vcfItem, 0, ["vcfLine", "input"]),
          protvistaFeatureId: vcfItem.id,
        };
      } // TODO handle else
      return null;
    })
    .filter((variant) => variant);
};

export default transformData;
