const path = require("path");
const currentTask = process.env.npm_lifecycle_event;
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const fse = require("fs-extra");

const postCSSPlugins = [require("postcss-import"), require("postcss-simple-vars"), require("postcss-mixins"), require("postcss-nested"), require("autoprefixer")];

/*module.exports = {
    entry: "./src/main.js",
    output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "index.js",
  },*/
//mode: "development",
//devtool: "source-map",
/*devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, "src"),
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: "index.html" },
  },*/
/*module: {
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
};*/

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy files", function () {
      fse.copySync("./src/main.css", "./dist/main.css");
      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    });
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: ["css-loader", { loader: "postcss-loader", options: { postcssOptions: { plugins: postCSSPlugins } } }],
};

let config = {
  entry: "./src/main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "src"),
    filename: "bundled.js",
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index-template.html",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
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
      cssConfig,
    ],
  },
};

if (currentTask == "dev") {
  cssConfig.use.unshift("style-loader");

  config.mode = "development";
  config.devtool = "source-map";
  config.devServer = {
    port: 3000,
    static: {
      directory: path.join(__dirname, "src"),
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: "index.html" },
  };
}

if (currentTask == "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.plugins.push(new MiniCssExtractPlugin({ filename: "styles.[chunkhash].css" }), new CleanWebpackPlugin(), new RunAfterCompile());
  config.mode = "production";
  config.output = {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
  };
}

module.exports = config;
