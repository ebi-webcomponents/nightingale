import { dirname, join } from "path";
import remarkGfm from "remark-gfm";

module.exports = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-storysource"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  typescript: {
    check: false,
  },

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {},
  },

  docs: {},
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
