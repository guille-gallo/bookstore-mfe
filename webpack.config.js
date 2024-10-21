const path = require('path');

module.exports = {
  entry: './src/guille-books-store.tsx', // Entry file
  output: {
    filename: 'bookstore-mfe.js', // Output filename
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system', // Required for Single-SPA SystemJS
    publicPath: '', // Ensure correct asset paths
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve file extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Handle TS and TSX files
        loader: 'ts-loader', // Use ts-loader to compile TypeScript
        options: { transpileOnly: true }, // Speed up compilation
        exclude: /node_modules/, // Exclude node_modules
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'], // Inject styles and handle CSS imports
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Handle image files
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/, // Handle font files
        type: 'asset/resource',
      },
    ],
  },
  externals: {
    react: 'react', // Externalize React to be provided by the root app
    'react-dom': 'react-dom', // Externalize ReactDOM
    'single-spa-react': 'single-spa-react', // Externalize single-spa-react
  },
};
