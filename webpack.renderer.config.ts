import type { Configuration } from 'webpack';
import path from 'path';
import CopyWebpackPlugin = require('copy-webpack-plugin');

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/@mediapipe/tasks-vision/wasm'),
          to: 'mediapipe/wasm',
        },
        {
          from: path.resolve(__dirname, 'resources/mediapipe/models'),
          to: 'mediapipe/models',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
