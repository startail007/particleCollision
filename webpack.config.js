const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin"); //壓縮css
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //清除檔案資料
module.exports = {
  /*build: {
    assetsPublicPath: "/dist/",
    assetsSubDirectory: "/dist/",
  },*/
  resolve: {
    //擴展路徑別名
    alias: {
      "@fonts": path.resolve(__dirname, "./src/fonts/"),
      "@img": path.resolve(__dirname, "./src/img/"),
      "@css": path.resolve(__dirname, "./src/css/"),
      "@js": path.resolve(__dirname, "./src/js/"),
      "@src": path.resolve(__dirname, "./src/"),
    },
    //擴展副檔名
    extensions: [".js", ".json"],
  },
  entry: {
    //main: "./src/js/index.js",
    "./particleCollision/js/main": "./src/particleCollision/index.js",
    "./quadTree/js/main": "./src/quadTree/index.js",
    "./particleCollision-quadTree/js/main": "./src/particleCollision-quadTree/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist/"),
    //publicPath: "/assets/",
    filename: "[name].[hash].js",
  },
  devServer: {
    contentBase: path.join(__dirname, "/"),
    compress: true,
    port: 9001,
    inline: true,
  },
  module: {
    rules: [
      //css提取
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      //cleanOnceBeforeBuildPatterns: ["./js/*", "./css/*", "./fonts/*", "./index,html"],
      cleanOnceBeforeBuildPatterns: ["./*"],
    }),
    new MiniCssExtractPlugin({ filename: "css/[name].[hash].css" }),
    new HtmlWebpackPlugin({
      title: "粒子碰撞",
      template: "./src/index.html",
      filename: "index.html",
      hash: true,
      chunks: [],
    }),
    new HtmlWebpackPlugin({
      title: "particleCollision",
      template: "./src/particleCollision/index.html",
      filename: "particleCollision/index.html",
      hash: true,
      chunks: ["./particleCollision/js/main"],
    }),
    new HtmlWebpackPlugin({
      title: "quadTree",
      template: "./src/quadTree/index.html",
      filename: "quadTree/index.html",
      hash: true,
      chunks: ["./quadTree/js/main"],
    }),
    new HtmlWebpackPlugin({
      title: "particleCollision-quadTree",
      template: "./src/particleCollision-quadTree/index.html",
      filename: "particleCollision-quadTree/index.html",
      hash: true,
      chunks: ["./particleCollision-quadTree/js/main"],
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
};
