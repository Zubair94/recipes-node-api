const path = require('path');
const nodeExternals = require('webpack-node-externals');
const DotEnv = require('dotenv-webpack');
module.exports = {
  mode: 'none',
  entry: {
    server: './src/server.ts'
  },
  target: 'node',
  externals: [
      nodeExternals()
  ],
  resolve: { extensions: ['.js', '.ts'] },
  optimization: {
    minimize: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module:{
    noParse: /polyfills-.*\.js/,
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new DotEnv()
  ]
};
