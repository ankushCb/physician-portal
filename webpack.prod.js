const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const baseConfig = require('./webpack.base.js');

const APP_DIR = path.resolve(__dirname, 'src/client/app');

module.exports = {
  devtool: 'sourcemap',
  entry: {
    vendor: [
      'd3',
      'babel-polyfill',
      'lodash',
      'moment',
      'react',
      'axios',
      'formsy-react',
      'react',
      'react-dom',
      'immutable',
      'redux-saga',
      'raven-js',
      'redux',
    ],
    app: ['babel-polyfill', path.join(process.cwd(), 'src/client/app/index.jsx')],
  },
  output: {
    path: path.resolve(process.cwd(), 'src/client/public'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].js.map',
    publicPath: './',
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: APP_DIR,
        loader: 'babel',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.scss$/,
        include: APP_DIR,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        include: APP_DIR,
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs
      sourceMap: true,
    }),
    new webpack.DefinePlugin(Object.assign({}, baseConfig.constants, {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BACKEND: JSON.stringify(process.env.BACKEND),
      },
    })),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[chunkhash].js'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),
    new HtmlWebpackPlugin({
      template: 'src/client/template.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, 'src/client/public'),
    }),
    // new BundleAnalyzerPlugin()
  ],

  resolve: {
    root: path.resolve('src/client/app'),
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  }],
};
