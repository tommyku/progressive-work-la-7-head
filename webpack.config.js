var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'public'); // eslint-disable-line
var APP_DIR = path.resolve(__dirname, 'src'); // eslint-disable-line

var config = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
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
          {loader: 'css-loader'}
        ]
      }
    ]
  },
  plugins: [
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
