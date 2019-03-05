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

export default filters;
