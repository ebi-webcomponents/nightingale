const PROD = process.env.NODE_ENV === 'production';

const rules= {
  'comma-dangle': ['warn', 'only-multiline'],
  'semi': ['warn', 'always', {'omitLastInOneLineBlock': true}],
};

if (!PROD) {
  rules['no-debugger'] = ['off'];
}

module.exports = {
  extends: ['standard', 'plugin:import/errors', 'plugin:import/warnings',],
  plugins: ['import'],
  rules,
  env: {
    browser: true,
  },
  globals: {
    customElements: false,
  },
};
