import path from "node:path";
import process from "node:process";

import { Configuration } from "@rspack/cli";
import { HtmlRspackPlugin, CssExtractRspackPlugin, CopyRspackPlugin } from "@rspack/core";

const isProduction = process.env.NODE_ENV === "production";

const config: Configuration = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "source-map",
  performance: {
    maxAssetSize: 1_000_000,
  },
  devServer: {
    hot: true,
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  },
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico|webmanifest)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          isProduction
            ? CssExtractRspackPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: { 
              url: false,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: isProduction ? [
    new HtmlRspackPlugin({
      template: "./public/index.html",
      minify: true,
      chunks: ["main"],
    }),
    new CssExtractRspackPlugin({
      filename: "styles.css",
    }),
    new CopyRspackPlugin({
      patterns: [
        { 
          from: "public/assets", 
          to: "assets",
        },
      ]
    })
  ] : [
    new HtmlRspackPlugin({
      template: "./public/index.html",
      minify: true,
      chunks: ["main"],
    }),
  ],
};

export default config;