const path = require("path");

const postCSSPlugins = [require("postcss-import"), require("postcss-simple-vars"), require("postcss-mixins"), require("postcss-nested"), require("autoprefixer")];

module.exports = {
  entry: "./src/main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "index.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "src"),
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: "index.html" },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }],
      },
    ],
  },
};
