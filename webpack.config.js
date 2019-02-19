const webpack = require("webpack");
const path = require("path");
const camelCase = require("camelcase");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const config = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(PACKAGE_ROOT_PATH, "dist"),
    library: camelCase(PKG_JSON.name, { pascalCase: true }),
    filename: PKG_JSON.name + ".js"
  },
  target: "web",
  devtool: "source-map",
  resolve: {
    extensions: [".js"]
  },
  externals: {
    "uniprot-entry-data-adapter": "UniProtEntryDataAdapter",
    "protvista-uniprot-entry-adapter": "ProtvistaUniprotEntryAdapter",
    d3: "d3",
    "protvista-zoomable": "ProtvistaZoomable",
    "protvista-track": "ProtvistaTrack",
    "resize-observer-polyfill": "ResizeObserver",
    litemol: "Litemol"
  },
  plugins: [new CleanWebpackPlugin([path.join(PACKAGE_ROOT_PATH, "dist")])],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } }
        ]
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            exclude: "node_modules/**",
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: 11,
                    browsers: "last 2 versions"
                  },
                  modules: false
                }
              ]
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true
                }
              ]
            ]
          }
        }
      }
    ]
  }
};

module.exports = config;
