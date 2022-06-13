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
  ],
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@nightingale-elements/nightingale-new-core": path.resolve(
        __dirname,
        "../packages/nightingale-new-core/src/index.ts"
      ),
    };
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: path.resolve(__dirname, "../packages"),
      loader: require.resolve("ts-loader"),
    });
    // console.log(config.module.rules[0].use);
    return config;
  },
};
