import groupBy from "lodash-es/groupBy";
import { formatXrefs, getEvidenceFromCodes } from "protvista-feature-adapter";

const getDiseaseAssociations = associations => {
  return associations
    .map(
      association => `
              <h4>Disease association</h4><p>${association.name}</p>
              ${
                association.xrefs
                  ? `<h5>Cross-references</h5>${formatXrefs(association.xrefs)}`
                  : ""
              }
              ${getEvidenceFromCodes(association.evidences)}
          `
    )
    .join("");
};

const getUniProtHTML = variant => {
  return `<h4>UniProt</h4>
        ${
          variant.descriptionArray && variant.descriptionArray.UP
            ? `<h5>Description</h5><p>${variant.descriptionArray.UP.join(
                "; "
              )}</p>`
            : ``
        }
        ${variant.ftId ? `<h5>Feature ID</h5><p>${variant.ftId}</p>` : ``}
        ${
          variant.association ? getDiseaseAssociations(variant.association) : ""
        }
        `;
};

const getLSSHTML = variant => {
  return `<h4>Large scale studies</h4>
        ${
          variant.descriptionArray && variant.descriptionArray.LSS
            ? `<h5>Description</h5><p>${variant.descriptionArray.LSS}</p>`
            : ``
        }
        ${
          variant.frequency
            ? `<h5>Frequency (MAF)</h5><p>${variant.frequency}</p>`
            : ``
        }
        <h5>Cross-references</h5>${formatXrefs(variant.xrefs)}
        `;
};

const getDescriptionsAsArray = description => {
  let descriptionArray = description.split(/\[LSS_|\[SWP]: /g);
  descriptionArray = groupBy(descriptionArray, desc => {
    if (desc.length === 0) {
      return "NOTHING";
    }
    if (desc.indexOf("]: ") !== -1) {
      return "LSS";
    }
    return "UP";
  });
  descriptionArray.LSS = descriptionArray.LSS
    ? descriptionArray.LSS.join("; ").replace(/]: /g, ": ")
    : undefined;
  return descriptionArray;
};

const formatTooltip = variant => {
  if (variant.description)
    // eslint-disable-next-line no-param-reassign
    variant.descriptionArray = getDescriptionsAsArray(variant.description);
  return `
                <h5>Variant</h5><p>${variant.wildType} > ${
    variant.alternativeSequence
  }</p>
                ${
                  variant.frequency
                    ? `<h5>Frequency (MAF)</h5><p>${variant.frequency}</p>`
                    : ``
                }
                ${
                  variant.siftScore
                    ? `<h5>SIFT</h5><p>${variant.siftPrediction} ${variant.siftScore}</p>`
                    : ``
                }
                ${
                  variant.polyphenScore
                    ? `<h5>Polyphen</h5><p>${variant.polyphenPrediction} ${variant.polyphenScore}</p>`
                    : ``
                }
                ${
                  variant.consequenceType
                    ? `<h5>Consequence</h5><p>${variant.consequenceType}</p>`
                    : ``
                }
                ${
                  variant.somaticStatus
                    ? `<h5>Somatic</h5><p>${
                        variant.somaticStatus === 0 ? "No" : "Yes"
                      }</p>`
                    : ``
                }
                ${
                  variant.genomicLocation
                    ? `<h5>Location</h5><p>${variant.genomicLocation}</p>`
                    : ``
                }
                ${
                  variant.sourceType === "UniProt" ||
                  variant.sourceType === "mixed"
                    ? `<hr/>${getUniProtHTML(variant)}`
                    : ""
                }
                ${
                  variant.sourceType === "large_scale_study" ||
                  variant.sourceType === "mixed"
                    ? `<hr/>${getLSSHTML(variant)}`
                    : ""
                }
        `;
};

export default formatTooltip;
