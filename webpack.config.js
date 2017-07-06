var webpack = require('webpack')
var path = require('path')
var glob = require("glob")

var {examplesDir, readmesDir, examplesRegex, readmesRegex, readmesMap} = getExamplesConfig()
console.log(examplesDir, readmesDir, readmesMap)
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
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      //'process$1.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __examplesDir: JSON.stringify(examplesDir),
      __readmesDir: JSON.stringify(readmesDir),
      __examplesRegex: examplesRegex,
      __readmesRegex: readmesRegex,
      __readmesMap: readmesMap
    })
  ],
  devServer: {
    //contentBase: path.join(__dirname, "examples"),
    historyApiFallback: true
  }
};

function getExamplesConfig() {
  let examplesDir = path.join(__dirname, 'examples').replace(/\\/g,'/')
  let readmesDir = `html-loader!markdown-loader!${examplesDir}`
  let pjs = glob.sync(path.join(examplesDir, '/**/package.json'))
  let examples = [], readmes = [], readmesMap = {}
  let moduleFriendly = p => path.relative(examplesDir, require.resolve(p)).replace(/\\/g,'/')
  pjs.forEach(pj => {
    let dir = pj.replace(/\/package\.json$/, '')
    let [readme] = glob.sync(path.join(dir, 'README.md'))
    examples.push(moduleFriendly(dir))
    if(readme) {
      readmes.push(moduleFriendly(readme))
      readmesMap[examples.length-1] = readmes.length - 1
    }
  })
  let pathsRegex = paths => new RegExp(paths.length ? paths.join('$|').concat('$') : '.^')
  return {examplesDir, readmesDir, examplesRegex: pathsRegex(examples), readmesRegex: pathsRegex(readmes), readmesMap}
}
