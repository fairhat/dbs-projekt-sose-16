const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const validate = require('webpack-validator')
const merge = require('webpack-merge')
const { devServer, CSS } = require('./lib/webpack.additional.js')
let config

const PATHS = {
  app: path.join(__dirname, 'frontend'),
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
      })
  ],
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
        include: PATHS.app,
      }
    ]
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