
const scaleColors = {
  UPDiseaseColor: '#990000',
  UPNonDiseaseColor: '#99cc00',
  predictedColor: '#4c8acd',
  othersColor: '#009e73',
};

const filterConfig = [
  {
    name: 'disease',
    type: {
      name: 'consequence',
      text: 'Filter Consequence',
    },
    options: {
      label: 'Likely pathogenic or pathogenic',
      color: scaleColors.UPDiseaseColor,
    },
    filterData: () => {},
  },
  {
    name: 'predicted',
    type: {
      name: 'consequence',
      text: 'Filter Consequence',
    },
    options: {
      label: 'Predicted consequence',
      color: scaleColors.predictedColor,
    },
    filterData: () => {},
  },
  {
    name: 'nonDisease',
    type: {
      name: 'consequence',
      text: 'Filter Consequence',
    },
    options: {
      label: 'Likely benign or benign',
      color: scaleColors.UPNonDiseaseColor,
    },
    filterData: () => {},
  },
  {
    name: 'uncertain',
    type: {
      name: 'consequence',
      text: 'Filter Consequence',
    },
    options: {
      label: 'Uncertain significance',
      color: scaleColors.othersColor,
    },
    filterData: () => {},
  },
];

export default filterConfig;
