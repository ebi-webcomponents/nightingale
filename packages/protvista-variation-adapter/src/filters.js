import cloneDeep from 'lodash-es/cloneDeep';

const filters = [{
  name: 'disease',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    console.log('disease');
    return clonedVariants.filter(variant =>
        (variant.association && variant.association.some(d => d.disease)) ||
        (variant.clinicalSignificances && variant.clinicalSignificances === 'disease'));
  }
}, {
  name: 'predicted',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    console.log('Predicted');
    return clonedVariants.filter(variant => variant.sourceType === 'large_scale_study');
  }
}, {
  name: 'nonDisease',
  applyFilter: variants => {
    const clonedVariants = cloneDeep(variants) || [];
    return clonedVariants.filter(variant =>
      (variant.association && variant.association.some(d => !d.disease)) ||
      (variant.clinicalSignificances && variant.clinicalSignificances === 'likely benign'));
  }
}, {
  name: 'uncertain',
  applyFilter: variants => []
}, {
  name: 'UniProt',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant => variant.xrefNames && variant.xrefNames.includes('uniprot'));
  }
}, {
  name: 'ClinVar',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant => variant.xrefNames && variant.xrefNames.includes('clinvar'));
  }
}, {
  name: 'LSS',
  applyFilter:(variants=[]) => {
    const clonedVariants = cloneDeep(variants) || [];
    return clonedVariants.filter(variant =>
      variant.sourceType === 'large_scale_study' ||
      variant.sourceType === 'mixed');
  }
}];

export default (name) => {
  // TODO(vpoddar): handle invalid filter name
  return filters.find(f => name === f.name);
};
