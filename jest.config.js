const { readdirSync } = require("fs");
const camelCase = require("camelcase");

const packageNames = readdirSync("packages", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Because of the monorepo's dependency management
// we need to manually map packages
const getPackageNames = () =>
  packageNames.reduce((acc, packageName) => {
    acc[packageName] = `<rootDir>/packages/${packageName}/src/${camelCase(
      packageName,
      {
        pascalCase: true,
      }
    )}.js`;
    return acc;
  }, {});

module.exports = {
  transformIgnorePatterns: ["/!node_modules\\/lodash-es/"],
  transform: {
    "^.+\\.(tsx|js|ts)?$": "babel-jest",
  },
  moduleNameMapper: {
    ...getPackageNames(),
    "\\.(tsv)$": "<rootDir>/__mocks__/example.tsv",
  },
};
