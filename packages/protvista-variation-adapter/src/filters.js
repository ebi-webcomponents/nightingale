import cloneDeep from 'lodash-es/cloneDeep';

const filterData = [
  {
    name: 'disease',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Likely disease'],
      colors: ['#990000']
    }
  }, {
    name: 'predicted',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Predicted deleterious', 'Predicted benign'],
      colors: ['#002594', '#8FE3FF']
    }
  }, {
    name: 'nonDisease',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Likely benign'],
      colors: ['#99cc00'],
    }
  }, {
    name: 'uncertain',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Uncertain'],
      colors: ['#FFCC00']
    }
  }, {
    name: 'UniProt',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['UniProt reviewed'],
      colors: ['#e5e5e5']
    }
  }, {
    name: 'ClinVar',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['ClinVar reviewed'],
      colors: ['#e5e5e5']
    }
  }, {
    name: 'LSS',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['Large scale studies'],
      colors: ['#e5e5e5']
    }
  }
];

const filters = [{
  name: 'disease',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant =>
        (variant.association && variant.association.some(d => d.disease)) ||
        (variant.clinicalSignificances && variant.clinicalSignificances === 'disease'));
  }
}, {
  name: 'predicted',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant => variant.sourceType === 'large_scale_study');
  }
}, {
  name: 'nonDisease',
  applyFilter: variants => {
    const clonedVariants = cloneDeep(variants) || [];
    return clonedVariants.filter(variant =>
      (variant.association && variant.association.some(d => !d.disease)) ||
      (variant.clinicalSignificances &&
        (variant.clinicalSignificances === 'likely benign'|| variant.clinicalSignificances === 'Likely benign')));
  }
}, {
  name: 'uncertain',
  applyFilter: variants => []
}, {
  name: 'UniProt',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant =>
      variant.xrefNames &&
      (variant.xrefNames.includes('uniprot') || variant.xrefNames.includes('UniProt')));
  }
}, {
  name: 'ClinVar',
  applyFilter: (variants=[]) => {
    const clonedVariants = cloneDeep(variants);
    return clonedVariants.filter(variant =>
      variant.xrefNames &&
      (variant.xrefNames.includes('ClinVar') || variant.xrefNames.includes('clinvar')));
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

const identity = (variants) => variants;

export const getFilter = (name) => {
  const filter = filters.find(f => name === f.name);
  if (!filter) {
    console.error(`No filter found for: ${name}`);
  }
  return filter ? filter : {applyFilter: identity};
};

export default filterData;
