import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ModuleOptions } from "webpack";
import { IBuildOptions } from "./types";
import ReactRefreshTypescript from "react-refresh-typescript";

// обратный порядок, последний обработчик - первым
export default function buildLoaders(
  options: IBuildOptions
): ModuleOptions["rules"] {
  const isDev = options.mode === "development";

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  };

  const cssLoader = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64:8]",
      },
    },
  };

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      cssLoader,
      "sass-loader",
    ],
  };

  const svgLoader = {
    test: /\.svg$/,
    use: [
      {
        loader: "@svgr/webpack",
        options: {
          icon: true,
          svgoConfig: [
            {
              name: "convertColors",
              params: {
                currentColor: true,
              },
            },
          ],
        },
      },
    ],
  };

  const typescriptLoader = {
    test: /\.tsx?$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypescript()].filter(Boolean),
          }),
        },
      },
    ],
    exclude: /node_modules/,
  };

  const babelLoader = {
    test: /\.tsx$/,
    exclude: /node_modules/,
    use: ["babel-loader"],
  };

  return [
    assetLoader,
    scssLoader,
    /* typescriptLoader */ babelLoader,
    svgLoader,
  ];
}
