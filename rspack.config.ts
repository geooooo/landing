import { Configuration } from "@rspack/cli";
import { CssExtractRspackPlugin } from "@rspack/core";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

class RemoveTrashFilesPlugin {
  static readonly trashPostfix = "__trash__";
  
  apply(compiler: any) {
    compiler.hooks.afterEmit.tap("RemoveIgnoreFilesPlugin", (compilation: any) => {
      const outputPath = compilation.outputOptions.path;
      const files = fs.readdirSync(outputPath);

      for (const file of files) {
        if (file.includes(RemoveTrashFilesPlugin.trashPostfix)) {
          fs.unlinkSync(path.join(outputPath, file));
        }
      }
    });
  }
}

const isProduction = process.env.NODE_ENV === "production";

const config: Configuration = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "source-map",
  entry: {
    main: "./src/main.ts",
    styles: "./src/main.scss",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: (pathData) => {
      if (pathData.chunk?.name === "styles") {
        return `[name]${RemoveTrashFilesPlugin.trashPostfix}`;
      }
      return "[name].js";
    },
    clean: false,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
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
          CssExtractRspackPlugin.loader,
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
  plugins: [
    new CssExtractRspackPlugin({
      filename: "styles.css",
    }),
    new RemoveTrashFilesPlugin(),
  ],
};

export default config;