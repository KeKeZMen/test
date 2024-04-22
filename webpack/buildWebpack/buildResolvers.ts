import { Configuration } from "webpack";
import { IBuildOptions } from "./types";

export default function buildResolvers(
  options: IBuildOptions
): Configuration["resolve"] {
  return {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": options.paths.src,
    },
  };
}
