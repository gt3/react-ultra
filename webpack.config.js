var webpack = require('webpack')
var path = require('path')
var glob = require("glob")
var { examplesDir, examplesRegex } = getExamplesConfig()

module.exports = {
  devtool: "source-map",
  entry: './examples/entry.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'examples.bundle.js',
    sourceMapFilename: 'examples.bundle.map.js'
  },
  module: {
    loaders: [
      { test: /\.md$/, loader: 'html-loader!markdown-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __examplesDir: JSON.stringify(examplesDir),
      __examplesRegex: examplesRegex
    })
  ],
  devServer: {
    //contentBase: path.join(__dirname, "examples"),
    historyApiFallback: true
  }
};

function getExamplesConfig() {
  let examplesDir = path.join(__dirname, 'examples').replace(/\\/g,'/')
  let pjs = glob.sync(path.join(examplesDir, '/**/package.json'))
  let examples = []
  let moduleFriendly = p => path.relative(examplesDir, require.resolve(p)).replace(/\\/g,'/')
  pjs.forEach(pj => {
    let dir = pj.replace(/\/package\.json$/, '')
    examples.push(moduleFriendly(dir))
  })
  let pathsRegex = paths => new RegExp(paths.length ? paths.join('$|').concat('$') : '.^')
  return {examplesDir, examplesRegex: pathsRegex(examples)}
}
