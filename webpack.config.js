const path = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')
module.exports = {
  entry: './src/ts-vue/index.ts',
  mode: "development",
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'awesome-typescript-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'vue.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CheckerPlugin()
  ]
}