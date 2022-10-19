const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.config.common");

module.exports = merge(
  { ...commonConfig, module: { rules: [] } },
  {
    mode: "production",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: () => [require("autoprefixer")],
                },
              },
            },
            {
              loader: "sass-loader",
            },
          ],
        },
      ],
    },
  }
);
