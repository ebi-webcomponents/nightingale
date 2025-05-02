const path = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-storysource",
    "@storybook/addon-actions",
  ],
  typescript: {
    check: false,
  },
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@nightingale-elements/nightingale-new-core": path.resolve(
        __dirname,
        "../packages/nightingale-new-core/src/index.ts"
      ),
    };
    config.optimization = {
      ...config.optimization,
      usedExports: false,
      sideEffects: false,
    };
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: path.resolve(__dirname, "../packages"),
      loader: "ts-loader",
    });
    config.module.rules.push({
      test: /\.(tsv)$/,
      type: "asset/source",
    });
    return config;
  },
};
