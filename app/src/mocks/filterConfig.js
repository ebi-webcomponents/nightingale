const scaleColors = {
  UPDiseaseColor: "#990000",
  UPNonDiseaseColor: "#99cc00",
  predictedColor: "#4c8acd",
  othersColor: "#009e73",
};

const consequences = {
  uncertain: [/uncertain/i, /conflicting/i, /unclassified/i, /risk factor/i],
};

const significanceMatches = (clinicalSignificance, values) =>
  values.some((rx) => rx.test(clinicalSignificance));

export const getFilteredVariants = (variants, callbackFilter) =>
  variants.map((variant) => {
    const matchingVariants = variant.variants.filter((variantPos) =>
      callbackFilter(variantPos)
    );
    return {
      ...variant,
      variants: [...matchingVariants],
    };
  });

const filterConfig = [
  {
    name: "disease",
    type: {
      name: "consequence",
      text: "Filter Consequence",
    },
    options: {
      labels: ["Likely disease"],
      colors: [scaleColors.UPDiseaseColor],
    },
    filterData: (variants) =>
      getFilteredVariants(variants, (variantPos) =>
        variantPos.association?.some((association) => association.disease)
      ),
  },
  {
    name: "predicted",
    type: {
      name: "consequence",
      text: "Filter Consequence",
    },
    options: {
      labels: ["Predicted consequence"],
      colors: [scaleColors.predictedColor],
    },
    filterData: (variants) =>
      getFilteredVariants(variants, (variantPos) => variantPos.hasPredictions),
  },
  {
    name: "nonDisease",
    type: {
      name: "consequence",
      text: "Filter Consequence",
    },
    options: {
      labels: ["Likely benign"],
      colors: [scaleColors.UPNonDiseaseColor],
    },
    filterData: (variants) =>
      getFilteredVariants(variants, (variantPos) =>
        variantPos.association?.some(
          (association) => association.disease === false
        )
      ),
  },
  {
    name: "uncertain",
    type: {
      name: "consequence",
      text: "Filter Consequence",
    },
    options: {
      labels: ["Uncertain"],
      colors: [scaleColors.othersColor],
    },
    filterData: (variants) =>
      getFilteredVariants(
        variants,
        (variantPos) =>
          (typeof variantPos.clinicalSignificances === "undefined" &&
            !variantPos.hasPredictions) ||
          significanceMatches(
            variantPos.clinicalSignificances,
            consequences.uncertain
          )
      ),
  },
  {
    name: "UniProt",
    type: {
      name: "provenance",
      text: "Filter Provenance",
    },
    options: {
      labels: ["UniProt reviewed"],
      colors: ["#9f9f9f"],
    },
    filterData: (variants) =>
      getFilteredVariants(
        variants,
        (variantPos) =>
          variantPos.xrefNames &&
          (variantPos.xrefNames.includes("uniprot") ||
            variantPos.xrefNames.includes("UniProt"))
      ),
  },
  {
    name: "ClinVar",
    type: {
      name: "provenance",
      text: "Filter Provenance",
    },
    options: {
      labels: ["ClinVar reviewed"],
      colors: ["#9f9f9f"],
    },
    filterData: (variants) =>
      getFilteredVariants(
        variants,
        (variantPos) =>
          variantPos.xrefNames &&
          (variantPos.xrefNames.includes("ClinVar") ||
            variantPos.xrefNames.includes("clinvar"))
      ),
  },
  {
    name: "LSS",
    type: {
      name: "provenance",
      text: "Filter Provenance",
    },
    options: {
      labels: ["Large scale studies"],
      colors: ["#9f9f9f"],
    },
    filterData: (variants) =>
      getFilteredVariants(
        variants,
        (variantPos) =>
          variantPos.sourceType === "large_scale_study" ||
          variantPos.sourceType === "mixed"
      ),
  },
];

export const colorConfig = (variant) => {
  const variantWrapper = [{ variants: [variant] }];
  if (
    filterConfig
      .find((filter) => filter.name === "disease")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.UPDiseaseColor;
  }
  if (
    filterConfig
      .find((filter) => filter.name === "nonDisease")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.UPNonDiseaseColor;
  }
  if (
    filterConfig
      .find((filter) => filter.name === "uncertain")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.othersColor;
  }
  if (
    filterConfig
      .find((filter) => filter.name === "predicted")
      .filterData(variantWrapper)[0].variants.length > 0
  ) {
    return scaleColors.predictedColor;
  }
  return scaleColors.othersColor;
};

export default filterConfig;
