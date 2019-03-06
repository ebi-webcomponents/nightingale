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
      colors: ['#990000'],
      selected: true,
    }
  }, {
    name: 'predicted',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Predicted deleterious', 'Predicted benign'],
      colors: ['#002594', '#8FE3FF'],
      selected: true,
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
      selected: true,
    }
  }, {
    name: 'uncertain',
    type: {
      name: 'consequence',
      text: 'Filter Consequence'
    },
    options: {
      labels: ['Uncertain'],
      colors: ['#FFCC00'],
      selected: true
    }
  }, {
    name: 'UniProt',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['UniProt reviewed'],
      colors: ['#e5e5e5'],
      selected: true
    }
  }, {
    name: 'ClinVar',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['ClinVar reviewed'],
      colors: ['#e5e5e5'],
      selected: true,
    }
  }, {
    name: 'LSS',
    type: {
      name: 'provenance',
      text: 'Filter Provenance'
    },
    options: {
      labels: ['Large scale studies'],
      colors: ['#e5e5e5'],
      selected: true
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

const identity = (variants) => variants;

export const getFilter = (name) => {
  const filterFunction = filters.find(f => name === f.name);
  if (!filterFunction) {
    console.error(`No filter found for: ${name}`);
  }
  return filterFunction ? filterFunction : identity;
};

export default filterData;
