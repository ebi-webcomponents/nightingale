import {
  VariationData,
  VariationDatum,
  ProcessedVariationData,
} from "../types/nightingale-variation";

function processVariants(
  data?: VariationData
): ProcessedVariationData[] | null {
  const { variants, sequence } = data || {};
  if (!sequence || !variants) return null;

  const seq = sequence.split("");

  const mutationArray = seq.map((aa, i) => {
    return {
      type: "VARIANT",
      normal: aa,
      pos: i + 1,
      variants: [] as VariationDatum[],
    };
  });

  variants.forEach((variant) => {
    if (mutationArray[variant.start - 1]) {
      // Currently not dealing with variants outside of sequence
      mutationArray[variant.start - 1].variants.push(variant);
    }
  });
  return mutationArray;
}

export default processVariants;
