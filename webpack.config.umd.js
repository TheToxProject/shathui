const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  cache: true,
  entry: './src/index.js',
  output: {
    path: __dirname + '/umd',
    filename: 'tox-shathui.js',
    library: 'ToxShathui',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-native': {
        root: 'ReactNative',
        commonjs2: 'react-native',
        commonjs: 'react-native',
        amd: 'react-native'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VERSION': JSON.stringify(require('./package.json').version)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true
      },
      output: {
        comments: false
      }
    }),
    new CompressionPlugin({
      asset: '[path].gzip[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/
    })
  ]
};
