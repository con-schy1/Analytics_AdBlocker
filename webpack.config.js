const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Note: Loaders and Terser are removed for now since we are just copying.

module.exports = {
  mode: "development", // Set default to development for readable code
  target: "web",
  devtool: false,
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".temp_cache"),
  },
  // Webpack requires an entry point, but we are relying on the CopyPlugin below.
  // These bundles will be created but likely ignored in favor of the copied src folder.
  entry: {
    index: "./src/background.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle_ignore_me.js", // Placeholder bundle name
    clean: true, // Cleans dist folder before copying
  },
  // Module rules for Babel/CSS are removed to stop transpiling
  module: {
    rules: [],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        // Copies the entire 'src' folder into 'dist/src'
        { from: "src", to: "src" },
        // Copies manifest to the root of 'dist'
        { from: "manifest.json", to: "manifest.json" },
      ],
    }),
  ],
  // Optimization/Minification removed
  optimization: {
    minimize: false,
  },
};
