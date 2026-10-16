const path = require("path");

// pdbe-molstar's bundled stylesheets (its dark .scss, pulled in transitively by
// the viewer, and its prebuilt .css) must be treated as raw strings: the .scss is
// a side-effect import we don't use, and the structure component imports the .css
// as a string to inject into the document itself. Storybook's default css handling
// would otherwise try to parse them, so exclude them from existing css rules.
const PDBE_STYLE = /pdbe-molstar[\\/].*\.s?css$/;
function excludePdbeStylesFromCssRules(rules) {
  for (const rule of rules || []) {
    if (!rule || typeof rule !== "object") continue;
    if (Array.isArray(rule.oneOf)) excludePdbeStylesFromCssRules(rule.oneOf);
    if (rule.test && /css/.test(String(rule.test))) {
      rule.exclude = [].concat(rule.exclude || [], PDBE_STYLE);
    }
  }
}

/** @type {import('@storybook/web-components-webpack5').StorybookConfig} */
module.exports = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-storysource",
    // Storybook 8's webpack5 builder needs an explicit JS/TS compiler.
    "@storybook/addon-webpack5-compiler-swc",
  ],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  typescript: {
    check: false,
  },
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@nightingale-elements/nightingale-new-core": path.resolve(
        __dirname,
        "../packages/nightingale-new-core/src/index.ts"
      ),
      "@nightingale-elements/nightingale-variation": path.resolve(
        __dirname,
        "../packages/nightingale-variation/src/index.ts"
      ),
    };
    config.optimization = {
      ...config.optimization,
      usedExports: false,
      sideEffects: false,
    };
    excludePdbeStylesFromCssRules(config.module.rules);
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: path.resolve(__dirname, "../packages"),
      loader: "ts-loader",
      // transpile only — type-checking the whole tree here is unnecessary and
      // memory-heavy.
      options: { transpileOnly: true },
    });
    // pdbe-molstar css/scss imported as raw strings (see comment above).
    config.module.rules.push({
      test: PDBE_STYLE,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.(tsv)$/,
      type: "asset/source",
    });
    // README/markdown imported into MDX docs as raw strings (for <Markdown>).
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    // svg logos imported as URLs.
    config.module.rules.push({
      test: /\.svg$/,
      type: "asset/resource",
    });
    return config;
  },
};
