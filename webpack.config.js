const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  target: "web", // Ensures compatibility with the browser environment
  devtool: false, // Use source maps without eval
  cache: {
    type: "filesystem", // or 'memory'
    cacheDirectory: path.resolve(__dirname, ".temp_cache"),
    buildDependencies: {
      config: [__filename], // Build depends on config file
    },
  },
  entry: {
    popup: "./src/popup/popup.js", // Entry point for script.js
    // sidepanel: "./src/sidepanel/script.js", // Entry point for script.js
    // dashboard: "./src/dashboard/script.js", // Entry point for script.js
    options: "./src/options/myscripts.js", // Entry point for script.js
    background: "./src/background.js", // Entry point for script.js
    content: "./src/content.js", // Entry point for script.js
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    devtoolModuleFilenameTemplate: (info) => `file:///${info.resourcePath}`,
    clean: true, // Clean output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Target JavaScript files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: "babel-loader", // Use Babel loader if you want to transpile ES6+
          options: {
            presets: ["@babel/preset-env"], // Specify presets if using Babel
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/, // Handle images and fonts
        type: "asset/resource", // Use the built-in asset module
        generator: {
          filename: "./assets/[hash][ext][query]", // Specify output path for assets
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/popup/popup.html", to: "popup.html" },
        { from: "src/popup/popup.css", to: "popup.css" },

        // { from: "src/dashboard/index.html", to: "dashboard.html" },
        // { from: "src/dashboard/style.css", to: "dashboard.css" },

        // { from: "src/sidepanel/index.html", to: "sidepanel.html" },
        // { from: "src/sidepanel/style.css", to: "sidepanel.css" },

        { from: "src/options/options.html", to: "options.html" },
        { from: "src/options/options.css", to: "options.css" },

        { from: "manifest.json", to: "manifest.json" },
        { from: "src/rules.json", to: "rules.json" },
        { from: "src/assets", to: "assets" },
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^child_process$/,
    }),
  ],
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // Remove console logs
          },
          output: {
            comments: false, // Remove comments
          },
        },
      }),
    ],
  },
};

// npx webpack --mode development
// npx webpack --mode production
