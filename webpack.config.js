const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  // Path to your entry point. From this file Webpack will begin its work
  entry: './modules/index.js',
  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'boilerplate.js',
    library: 'boilerplate',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader
            },
            {
                // Interprets `@import` and `url()` like `import/require()` and will resolve them
                loader: 'css-loader'
            },
            {
                // Loader for webpack to process CSS with PostCSS
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [[ 'autoprefixer' ]]
                    }
                }
            },
            {
                // Loads a SASS/SCSS file and compiles it to CSS
                loader: 'sass-loader'
            }
        ]
    },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: 'main.css'
    })
  ],
  optimization: {
    minimizer: [
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin({})
    ]
  }
};
