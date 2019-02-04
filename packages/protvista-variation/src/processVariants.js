function processVariants(data) {
  const { variants, sequence } = data;

  if (!sequence || !variants) return;

  const mutationArray = [];

  const seq = sequence.split("");
  for (let i in seq) {
    mutationArray.push({
      type: "VARIANT",
      normal: seq[i],
      pos: i + 1,
      variants: []
    });
  }
  variants.forEach(variant => {
    if (mutationArray[variant.start - 1]) {
      //Currently not dealing with variants outside of sequence
      mutationArray[variant.start - 1].variants.push(variant);
    }
  });
  return mutationArray;
}

export default processVariants;
