/* eslint-disable no-param-reassign */
import { ProtvistaVariationDatum } from "protvista-variation";
import { VCFJSON } from "vcftojson/dist/types";

const style =
  "<style>.row{display:flex;} .column{flex:2;} .column:first-child{flex:1;text-overflow:ellipsis;overflow:hidden;text-align:right;margin-right:1rem;}</style>";

// Note: classes are defined in protvista-tooltip
export const JSONToHTML = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  obj: any,
  level = 1,
  ignoreKeys?: string[]
): string => {
  if (typeof obj !== "object") {
    return `<span>${obj}</span>`;
  }
  return `${Object.entries(obj)
    .map(([key, value]) => {
      if (ignoreKeys?.includes(key)) {
        return "";
      }
      if (Array.isArray(value)) {
        const reduced = `${value
          .map((value2) => JSONToHTML(value2, level++, ignoreKeys))
          .join("")}`;
        return `<h3>${key}</h3><section>${reduced}</section>`;
      }
      if (typeof value === "object") {
        return `<h3>${key}</h3><section>${JSONToHTML(
          value,
          level++,
          ignoreKeys
        )}</section>`;
      }
      return `<span class="row"><strong class="column" title="${key}">${key}</strong><span class="column">${value}</span></span>`;
    })
    .join("")}`;
};

const transformData = (
  vcfData: VCFJSON[],
  accession: string
): ProtvistaVariationDatum[] =>
  vcfData
    .map((vcfItem) => {
      // using startsWith as there seems to be a recent change in VEP which
      // appends a number to the accessions...
      const matchingTranscript = vcfItem.vep?.transcript_consequences.find(
        ({ swissprot, trembl }) =>
          (swissprot && swissprot.find((swp) => swp.startsWith(accession))) ||
          (trembl && trembl.find((trmbl) => trmbl.startsWith(accession)))
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
          sourceType: "VCF",
          xrefNames: [],
          hasPredictions: false,
          tooltipContent: `${style}${JSONToHTML(vcfItem, 0, [
            "vcfLine",
            "input",
          ])}`,
          protvistaFeatureId: vcfItem.id,
        };
      } // TODO handle else
      return null;
    })
    .filter((variant) => variant);

export default transformData;
