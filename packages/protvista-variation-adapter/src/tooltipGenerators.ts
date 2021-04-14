import { formatXrefs, getEvidenceFromCodes } from "protvista-feature-adapter";
import groupBy from "lodash-es/groupBy";
import {
  Association,
  Description,
  PopulationFrequency,
  Prediction,
  Variant,
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

export const getEnsemblCovidLinks = (variant: Variant) => {
  const shouldGenerateLink = variant.locations.some(
    (location) => location.source === "EnsemblViruses"
  );
  if (shouldGenerateLink) {
    const { id } = variant.xrefs.find((xref) => xref.name === "ENA");
    return (
      `<h5>Ensembl COVID-19</h5>` +
      `<p><a href="https://covid-19.ensembl.org/Sars_cov_2/Variation/Explore?v=${id}" target="_blank" rel="noopener noreferrer">${id}</a></p>`
    );
  }
  return "";
};

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

export const formatTooltip = (variant: Variant) =>
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
                ${getEnsemblCovidLinks(variant)}
                
        `;

export default formatTooltip;
