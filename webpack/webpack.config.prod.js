const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

const MEDIA_NAME = 'assets/[name].[hash:8].[ext]';
const BUNDLE_NAME = 'bundle.js';

module.exports = {
  cache: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'lib'),
    filename: BUNDLE_NAME
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        include: [/src\/*/, /node_modules\/react-native-/],
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-react-native')],
          cacheDirectory: true
        }
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: MEDIA_NAME
            }
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: MEDIA_NAME
            }
          }
        ]
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
      'process.env.VERSION': JSON.stringify(require('../package.json').version)
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
