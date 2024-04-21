import webpack from "webpack";
import buildWebpack from "./config/build/buildWebpack";
import { BuildModeType, IBuildPaths } from "./config/build/types/types";
import path from "path";

interface IEnvVariables {
  mode: BuildModeType;
  port: number;
  analyzer: boolean;
}

export default (env: IEnvVariables) => {
  const paths: IBuildPaths = {
    output: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "src", "app", "index.tsx"),
    html: path.resolve(__dirname, "src", "index.html"),
    src: path.resolve(__dirname, "src"),
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer,
  });

  return config;
};
