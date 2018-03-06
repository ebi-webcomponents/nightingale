function processVariants(variants, sequence) {
    // ??? if (source && (source !== Constants.getUniProtSource())) {
    // _.each(variants, function(variant) {         delete variant.category;     });
    // } ??? if (!evidenceAlreadyGrouped) {     variants =
    // groupEvidencesByCode(variants); }

    if(!sequence)
        return;

    const mutationArray = [];
    // ??? mutationArray.push({     'type': 'VARIANT',     'normal': 'del', 'pos':
    // 0,     'variants': [] });

    const seq = sequence.split('');
    for (let i in seq) {
        mutationArray.push({
            'type': 'VARIANT',
            'normal': seq[i],
            'pos': i + 1,
            'variants': []
        });
    }
    // ??? mutationArray.push({     'type': 'VARIANT',     'normal': 'del', 'pos':
    // seq.length + 1,     'variants': [] });

    for (let variant of variants) {
        variant.begin = +variant.begin;
        variant.end = variant.end
            ? + variant.end
            : variant.begin; // single position
        variant.wildType = variant.wildType
            ? variant.wildType
            : sequence.substring(variant.begin, variant.end + 1);
        variant.sourceType = variant.sourceType
            ? variant
                .sourceType
                .toLowerCase()
            : variant.sourceType;
        // if ((1 <= variant.begin) && (variant.begin <= seq.length)) {
        // mutationArray[variant.begin].variants.push(setVariantData(source, variant));
        // } else if ((seq.length + 1) === d.begin) {
        mutationArray[variant.begin - 1]
            .variants
            .push(variant);
        // } if (variant.consequence) { Constants.addConsequenceType(d.consequence); }
    };
    return mutationArray;
}

export {processVariants};