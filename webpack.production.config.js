var webpack = require('webpack');
var path = require('path');
var workboxPlugin = require('workbox-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, '.');
var APP_DIR = path.resolve(__dirname, 'src');

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
      }
    ]
  },
  plugins: [
    new workboxPlugin({
      globDirectory: BUILD_DIR,
      staticFileGlobs: ['bundle.js', 'index.html'],
      swDest: path.join(BUILD_DIR, 'service-worker.js'),
    }),
  ]
};

module.exports = config;
