import { scaleLinear } from "d3-scale";

const scaleColours = {
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
      colors: [scaleColours.UPDiseaseColor]
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
      colors: [scaleColours.deleteriousColor, scaleColours.benignColor]
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
      colors: [scaleColours.UPNonDiseaseColor]
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
      colors: [scaleColours.othersColor]
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
  .range([scaleColours.deleteriousColor, scaleColours.benignColor]);

const getPredictionColour = (polyphenScore, siftScore) => {
  return predictionScale(
    (siftScore || 0 + (1 - polyphenScore ? polyphenScore : 1)) /
      (polyphenScore && siftScore ? 2 : 1)
  );
};

export const colourConfig = variant => {
  const variantWrapper = [{variants:[variant]}];
  if (filterConfig.find(filter => filter.name === 'disease').filterData(variantWrapper)[0].variants.length > 0) {
    return scaleColours.UPDiseaseColor;
  }
  if (filterConfig.find(filter => filter.name === 'nonDisease').filterData(variantWrapper)[0].variants.length > 0) {
    return scaleColours.UPNonDiseaseColor;
  }
  if (filterConfig.find(filter => filter.name === 'uncertain').filterData(variantWrapper)[0].variants.length > 0){
    return scaleColours.othersColor;
  }
  if (filterConfig.find(filter => filter.name === 'predicted').filterData(variantWrapper)[0].variants.length > 0){
    return getPredictionColour(variant.polyphenScore, variant.siftScore);
  }
  return scaleColours.othersColor;
};

export default filterConfig;
