export interface IBuildPaths {
  entry: string;
  html: string;
  output: string;
  src: string;
}

export type BuildModeType = "production" | "development";

export interface IBuildOptions {
  port: number;
  paths: IBuildPaths;
  mode: BuildModeType;
  analyzer?: boolean;
}
