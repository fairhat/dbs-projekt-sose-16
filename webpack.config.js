const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const { devServer, CSS } = require('./lib/webpack.additional.js')
let config

const PATHS = {
  app: path.join(__dirname, 'frontend'),
  template: path.join(__dirname, 'frontend/templates/index.html'),
  dist: path.join(__dirname, 'dist'),
}

const generalConfig = {
  entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.dist,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'DBS Projekt SoSe 16',
        template: PATHS.template,
      })
  ],
  resolve: {
    alias: {
      'views': __dirname + '/frontend/views/',
      'components': __dirname + '/frontend/components/',
      'api': __dirname + '/frontend/lib/api',
    },
    extensions: ['', '.js', '.jsx', '.css']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
      {
        test: /\.js?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      }
    ],
  }
}

switch(process.env.npm_lifecycle_event) {
  case 'build:frontend': {
    config = merge(generalConfig, { devtool: 'source-map' }, CSS())
  }
  default: {
    config = merge(
      generalConfig,
      devServer({}),
      { devtool: 'eval-source-map' },
      CSS()
    )
  }
}

module.exports = validate(config)
