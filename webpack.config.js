const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const baseConfig = require('./webpack.base.js');

/*
 * Defines path here.
 */
const BUILD_DIR = path.resolve(__dirname, 'src/client/public');
const APP_DIR = path.resolve(__dirname, 'src/client/app');
/*
 * Config file for webpack.
 * Change here in order to change the webpack settings
 */
const config = {
  /*
   * Entry point describes the single page app JS.
   */
  entry: [
    'babel-polyfill',
    path.join(process.cwd(), 'src/client/app/index.jsx'),
  ],
  /*
   * Output describes the properties of bundle js
   */
  output: {
    path: BUILD_DIR,
    publicPath: '/public/',
    filename: 'bundle.js',
  },
  /*
   * Loaders for ES6 (babel), styles (SASS Loader), (font) file loader and image.
   */
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      // { test: /\.css$/, loader: 'style-loader!css-loader' },
      { 
        test: /\.css$/, 
        loader: 'style!css?modules', 
        include: path.resolve(__dirname, 'node_modules', 'flexboxgrid') 
      },
      { 
        test: /\.css$/, 
        loader: 'style!css!postcss',
        include: path.join(__dirname, 'node_modules'),
        exclude: path.resolve(__dirname, 'node_modules', 'flexboxgrid') 
      },
      
      {
        test: /\.scss$/,
        include: APP_DIR,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        include: [APP_DIR, '/flexboxgrid/'],
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loaders: [
          'file-loader?name=img/img-[hash:6].[ext]',
        ],
      },
    ],
  },
  /*
   * Describes the root component. All imports can be done with absolute address
   */
  resolve: {
    root: path.resolve('src/client/app'),
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  }],
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(Object.assign({}, baseConfig.constants, {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BACKEND: JSON.stringify(process.env.BACKEND),
      },
    })),
  ],
  eslint: {
    configFile: './.eslintrc',
  },
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: '.',
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  watchOptions: {
    poll: true
  }
};

module.exports = config;
