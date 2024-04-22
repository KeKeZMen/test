import webpack from "webpack";
import buildWebpack from "./buildWebpack";
import {
  BuildModeType,
  BuildPlatformType,
  IBuildPaths,
} from "./buildWebpack/types";
import path from "path";

interface IEnvVariables {
  mode?: BuildModeType;
  port?: number;
  analyzer?: boolean;
  platform?: BuildPlatformType;
}

export default (env: IEnvVariables) => {
  const paths: IBuildPaths = {
    output: path.resolve(__dirname, "build"),
    entry: path.resolve(__dirname, "src", "app", "index.tsx"),
    html: path.resolve(__dirname, "public", "index.html"),
    src: path.resolve(__dirname, "src"),
    public: path.resolve(__dirname, "public")
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer,
    platform: env.platform ?? "desktop",
  });

  return config;
};
