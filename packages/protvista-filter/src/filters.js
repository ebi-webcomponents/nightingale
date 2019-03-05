import cloneDeep from 'lodash-es/cloneDeep';

const filters = [
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
          applyFilter: data => {
            const filteredData = cloneDeep(data.variants) || [];
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => {
              return (
                variant.association && variant.association.some(d => d.disease)) ||
                (variant.clinicalSignificances && variant.clinicalSignificances === 'disease')
            }));
            return filteredData;
          }
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
        applyFilter: data => {
          const filteredData = cloneDeep(data);
          filteredData.forEach(
            variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study'));
          return filteredData;

        }
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
          applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => {
                return (variant.association && variant.association.some(d => !d.disease)) || (variant.clinicalSignificances && variant.clinicalSignificances === 'likely benign')
            }));
            return filteredData;
        }
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
          applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(
                variants => variants.variants = variants.variants.filter(
                    variant => variant.xrefNames.includes('clinvar')));
            return filteredData;
        }
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

export const getFilter = name => {
  return filters.filter(f => name === f.name);
};

export default filters;
