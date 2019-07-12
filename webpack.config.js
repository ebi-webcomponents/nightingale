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
    d3: "d3",
    "protvista-zoomable": "ProtvistaZoomable",
    "protvista-track": "ProtvistaTrack",
    "protvista-feature-adapter": "ProtvistaFeatureAdapter",
    "protvista-utils": "protvista-utils",
    "protvista-sequence": "ProtVistaSequence"
  },
  plugins: [new CleanWebpackPlugin([path.join(PACKAGE_ROOT_PATH, "dist")])],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          { loader: "css-loader", options: { importLoaders: 1 } }
        ]
      },
      {
        test: /\.(js)$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            include: [
              "src",
              "../../node_modules/lit-html",
              "../../node_modules/lit-element",
              "../../node_modules/protvista-utils",
              "../../node_modules/protvista-sequence"
            ],
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
