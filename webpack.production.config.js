var webpack = require('webpack');
var path = require('path');
var workboxPlugin = require('workbox-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, '.'); // eslint-disable-line
var APP_DIR = path.resolve(__dirname, 'src'); // eslint-disable-line

var config = {
  entry: [
    APP_DIR + '/index.jsx'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          babelrc: false,
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /\.css$/,
        loader: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {minimize: true}}
        ]
      }
    ]
  },
  plugins: [
    new workboxPlugin({
      globDirectory: BUILD_DIR,
      staticFileGlobs: ['bundle.js', 'index.html'],
      swDest: path.join(BUILD_DIR, 'service-worker.js'),
    }),
    new webpack.DefinePlugin({
      buildNumber: JSON.stringify((new Date()).toString())
    })
  ],
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
};

module.exports = config;
