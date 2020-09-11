module.exports = {
  transformIgnorePatterns: ["/!node_modules\\/lodash-es/"],
  transform: {
    "^.+\\.(tsx|js|ts)?$": ["babel-jest", { rootMode: "upward" }],
  },
};
