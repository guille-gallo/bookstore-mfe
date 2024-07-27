const path = require('path');

module.exports = {
  entry: './src/bookstore-mfe.tsx',
  output: {
    filename: 'bookstore-mfe.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true, // Use transpileOnly mode to speed up compilation
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: ['react', 'react-dom', 'single-spa', 'single-spa-react'],
};
