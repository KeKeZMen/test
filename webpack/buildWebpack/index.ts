import webpack from "webpack";
import buildDevServer from "./buildDevServer";
import buildPlugins from "./buildPlugins";
import buildLoaders from "./buildLoaders";
import buildResolvers from "./buildResolvers";
import { IBuildOptions } from "./types";

export default function buildWebpack(
  options: IBuildOptions
): webpack.Configuration {
  const isDev = options.mode === "development";

  return {
    mode: options.mode ?? "development",
    entry: options.paths.entry,
    output: {
      path: options.paths.output,
      filename: "[name].[contenthash].js",
      clean: true,
    },
    plugins: buildPlugins(options),
    module: {
      strictExportPresence: true,
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    devServer: isDev && buildDevServer(options),
  };
}
