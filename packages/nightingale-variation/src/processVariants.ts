import {
  VariationData,
  VariationDatum,
  ProcessedVariationData,
} from "./nightingale-variation";

function processVariants(data?: VariationData): {
  mutationArray: ProcessedVariationData[];
  aaPresence: Record<string, boolean>;
} | null {
  const { variants, sequence } = data || {};
  if (!sequence || !variants) return null;
  const aaPresence: Record<string, boolean> = {};

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
      aaPresence[variant.variant || ""] = true;
    }
  });
  return { mutationArray, aaPresence };
}

export default processVariants;
