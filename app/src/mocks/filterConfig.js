import { scaleLinear } from "d3-scale";

const scaleColors = {
  UPDiseaseColor: "#990000",
  UPNonDiseaseColor: "#99cc00",
  deleteriousColor: "#002594",
  benignColor: "#8FE3FF",
  othersColor: "#009e73"
};

const consequences = {
  likelyDisease: [/disease/i, /pathogenic\b/i, /risk factor/i],
  likelyBenign: [/benign/i],
  uncertain: [/uncertain/i, /conflicting/i, /unclassified/i]
};

const significanceMatches = (clinicalSignificance, values) =>
  values.some(rx => rx.test(clinicalSignificance));

const getFilteredVariants = (variants, callbackFilter) =>
  variants.map(variant => {
    const matchingVariants = variant.variants.filter(variantPos =>
      callbackFilter(variantPos)
    );
    return {
      ...variant,
      variants: [...matchingVariants]
    };
  });

const filterConfig = [
  {
    name: "disease",
    type: {
      name: "consequence",
      text: "Filter Consequence"
    },
    options: {
      labels: ["Likely disease"],
      colors: [scaleColors.UPDiseaseColor]
    },
    filterData: variants =>
      getFilteredVariants(variants, variantPos =>
        significanceMatches(
          variantPos.clinicalSignificances,
          consequences.likelyDisease
        )
      )
  },
  {
    name: "predicted",
    type: {
      name: "consequence",
      text: "Filter Consequence"
    },
    options: {
      labels: ["Predicted deleterious", "Predicted benign"],
      colors: [scaleColors.deleteriousColor, scaleColors.benignColor]
    },
    filterData: variants =>
      getFilteredVariants(
        variants,
        variantPos =>
          typeof variantPos.polyphenScore !== "undefined" ||
          typeof variantPos.siftScore !== "undefined"
      )
  },
  {
    name: "nonDisease",
    type: {
      name: "consequence",
      text: "Filter Consequence"
    },
    options: {
      labels: ["Likely benign"],
      colors: [scaleColors.UPNonDiseaseColor]
    },
    filterData: variants =>
      getFilteredVariants(variants, variantPos =>
        significanceMatches(
          variantPos.clinicalSignificances,
          consequences.likelyBenign
        )
      )
  },
  {
    name: "uncertain",
    type: {
      name: "consequence",
      text: "Filter Consequence"
    },
    options: {
      labels: ["Uncertain"],
      colors: [scaleColors.othersColor]
    },
    filterData: variants =>
      getFilteredVariants(
        variants,
        variantPos =>
          (typeof variantPos.clinicalSignificances === "undefined" &&
            typeof variantPos.polyphenScore === "undefined" &&
            typeof variantPos.siftScore === "undefined") ||
          significanceMatches(
            variantPos.clinicalSignificances,
            consequences.uncertain
          )
      )
  },
  {
    name: "UniProt",
    type: {
      name: "provenance",
      text: "Filter Provenance"
    },
    options: {
      labels: ["UniProt reviewed"],
      colors: ["#9f9f9f"]
    },
    filterData: variants =>
      getFilteredVariants(
        variants,
        variantPos =>
          variantPos.xrefNames &&
          (variantPos.xrefNames.includes("uniprot") ||
            variantPos.xrefNames.includes("UniProt"))
      )
  },
  {
    name: "ClinVar",
    type: {
      name: "provenance",
      text: "Filter Provenance"
    },
    options: {
      labels: ["ClinVar reviewed"],
      colors: ["#9f9f9f"]
    },
    filterData: variants =>
      getFilteredVariants(
        variants,
        variantPos =>
          variantPos.xrefNames &&
          (variantPos.xrefNames.includes("ClinVar") ||
            variantPos.xrefNames.includes("clinvar"))
      )
  },
  {
    name: "LSS",
    type: {
      name: "provenance",
      text: "Filter Provenance"
    },
    options: {
      labels: ["Large scale studies"],
      colors: ["#9f9f9f"]
    },
    filterData: variants =>
      getFilteredVariants(
        variants,
        variantPos =>
          variantPos.sourceType === "large_scale_study" ||
          variantPos.sourceType === "mixed"
      )
  }
];

const predictionScale = scaleLinear()
  .domain([0, 1])
  .range([scaleColors.deleteriousColor, scaleColors.benignColor]);

const getPredictionColor = (polyphenScore, siftScore) => {
  return predictionScale(
    (siftScore || 0 + (1 - polyphenScore ? polyphenScore : 1)) /
      (polyphenScore && siftScore ? 2 : 1)
  );
};

export const colorConfig = variant => {
  const variantWrapper = [{ variants: [variant] }];
  if (
    filterConfig
      .find(filter => filter.name === "disease")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.UPDiseaseColor;
  }
  if (
    filterConfig
      .find(filter => filter.name === "nonDisease")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.UPNonDiseaseColor;
  }
  if (
    filterConfig
      .find(filter => filter.name === "uncertain")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.othersColor;
  }
  if (
    filterConfig
      .find(filter => filter.name === "predicted")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return getPredictionColor(variant.polyphenScore, variant.siftScore);
  }
  return scaleColors.othersColor;
};

export default filterConfig;
