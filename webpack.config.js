const path = require('path');

module.exports = {
  entry: './src/guille-books-store.tsx', // Adjust this to your actual entry file
  output: {
    filename: 'bookstore-mfe.js', // The output file name
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
      {
        test: /\.css$/, // Add this rule to handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: ['react', 'react-dom', 'single-spa-react'],
};
