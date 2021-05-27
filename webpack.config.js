// Webpack uses this to work with directories
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var ZipPlugin = require('zip-webpack-plugin');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin its work
  entry: './modules/boilerplate.js',

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
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
          from: 'css/main.css',
          to: ''
      },
      {
        from: 'css/styles.less',
        to: 'css/styles.less'
      },
      {
        from: 'js',
        to: 'js'
      },
      {
        from: 'index.html.mst',
        to: ''
      }]
    }),
    new ZipPlugin({
      path: '../',
      filename: 'boilerplate.zip',
      include: ['index.html.mst','css/styles.less','js/main.js'],
    })
  ],
  mode: 'production',
  devtool: 'source-map',
};
