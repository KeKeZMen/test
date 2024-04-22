import type { Configuration } from "webpack-dev-server";
import { IBuildOptions } from "./types";

export default function buildDevServer(options: IBuildOptions): Configuration {
  return {
    port: options.port ?? 3000,
    open: true,
    historyApiFallback: true,
    hot: true,
  };
}
