export interface IBuildPaths {
  entry: string;
  html: string;
  output: string;
  src: string;
  public: string;
}

export type BuildModeType = "production" | "development";
export type BuildPlatformType = "desktop" | "mobile";

export interface IBuildOptions {
  port: number;
  paths: IBuildPaths;
  mode: BuildModeType;
  platform: BuildPlatformType;
  analyzer?: boolean;
}
