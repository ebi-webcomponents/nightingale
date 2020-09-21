import { formatXrefs, getEvidenceFromCodes } from "protvista-feature-adapter";
import groupBy from "lodash-es/groupBy";
import {
  Association,
  Feature,
  Description,
  PopulationFrequency,
  Prediction,
} from "./variants";

export const getDiseaseAssociations = (associations: Association[]) =>
  associations
    ?.map(
      (association) => `
              <h4>Disease association</h4><p>${association.name}</p>
              ${
                association.description
                  ? `<>${association.description}</p>`
                  : ""
              }
              ${
                association.dbReferences
                  ? `<h5>Cross-references</h5>${formatXrefs(
                      association.dbReferences
                    )}`
                  : ""
              }
              ${getEvidenceFromCodes(association.evidences)}
          `
    )
    .join("");

export const getDescriptions = (descriptions: Description[]) =>
  `<hr/><h5>Description</h5>${descriptions
    .map((description) => `<p>${description.value}</p>`)
    .join("")}
  `;

export const getPopulationFrequencies = (
  popFrequencies: PopulationFrequency[]
) =>
  `<hr/><h5>Population frequencies</h5>${popFrequencies
    .map(
      (freq) =>
        `<p>${freq.frequency} - ${freq.populationName} (${freq.source})</p>`
    )
    .join("")}`;

export const getPredictions = (predictions: Prediction[]) => {
  const groupedPredictions = groupBy(predictions, "predAlgorithmNameType");
  const counts = Object.keys(groupedPredictions).map((key) => {
    const valueGroups = groupBy(groupedPredictions[key], "predictionValType");
    return {
      algorithm: key,
      values: Object.keys(valueGroups).map((valKey) => ({
        name: valKey,
        count: valueGroups[valKey].length,
      })),
    };
  });
  return counts
    .map(
      (countItem) =>
        `<h6>${
          countItem.algorithm
        }</h6><ul class="no-bullet">${countItem.values
          .map((countValue) => `<li>${countValue.name}</li>`)
          .join("")}</ul>`
    )
    .join("");
};

export const formatTooltip = (variant: Feature) =>
  `
                <h5>Variant</h5><p>${variant.wildType} > ${
    variant.alternativeSequence
  }</p>
                ${
                  variant.populationFrequencies
                    ? getPopulationFrequencies(variant.populationFrequencies)
                    : ""
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
                  variant.ftId
                    ? `<h5>Feature ID</h5><p>${variant.ftId}</p>`
                    : ``
                }
                ${
                  variant.descriptions
                    ? getDescriptions(variant.descriptions)
                    : ""
                }
                ${
                  variant.association
                    ? getDiseaseAssociations(variant.association)
                    : ""
                }
                ${
                  variant.predictions ? getPredictions(variant.predictions) : ""
                }

                
        `;

export default formatTooltip;
