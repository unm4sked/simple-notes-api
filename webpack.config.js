const path = require("path");
const slsw = require("serverless-webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [new CopyPlugin({ patterns: [{ from: ".env.dist" }] })],
  entry: slsw.lib.entries,
  mode: "none",
  target: "node14",
  externals: [
    "aws-sdk",
    "pg-native",
    "nock",
    "mock-aws-s3",
    "node-gyp",
    "aws-crt",
    "pino-pretty",
    "@aws-sdk/signature-v4-crt",
  ],
  node: {
    __dirname: true,
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  ignoreWarnings: [
    {
      module: /node_modules\/typeorm/,
      message: /Can't resolve/,
    },
    {
      module: /node_modules/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: process.env.NODE_ENV !== "dev",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
};
