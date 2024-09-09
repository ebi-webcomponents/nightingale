
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
      labels: ['Likely pathogenic or pathogenic'],
      colors: [scaleColors.UPDiseaseColor],
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
      labels: ['Predicted consequence'],
      colors: [scaleColors.predictedColor],
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
      labels: ['Likely benign or benign'],
      colors: [scaleColors.UPNonDiseaseColor],
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
      labels: ['Uncertain significance'],
      colors: [scaleColors.othersColor],
    },
    filterData: () => {},
  },
];

export default filterConfig;
