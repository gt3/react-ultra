var webpack = require('webpack')
var path = require('path')
var glob = require("glob")
var eol = require('os').EOL

let dir = process.argv.find(arg => /^examplesDir\=.+/.test(arg))
if(dir) dir = dir.replace('examplesDir=', '')
else throw new Error(`Missing argumnet: examplesDir ${eol}use: webpack-dev-server --define examplesDir=<path>${eol}use: npm start -- --define examplesDir=<path>`)

var { examplesDir, examplesRegex } = getExamplesConfig(dir)

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
    }),
    new webpack.NormalModuleReplacementPlugin(new RegExp(`^${escapeRx(dir)}$`), function(resource) {
      resource.context = __dirname
      resource.request = `./requireExamples`
    })
  ],
  externals: {
    "prop-types": "PropTypes",
    "react": "React",
    "react-dom": "ReactDOM",
    "ultra": "ultra"
  },
  devServer: {
    //contentBase: path.join(__dirname, "examples"),
    historyApiFallback: true
  }
};

function getExamplesConfig(loc) {
  let examplesDir = path.join(__dirname, loc).replace(/\\/g,'/')
  let pjs = glob.sync(path.join(examplesDir, '/**/package.json'))
  let examples = []
  let moduleFriendly = p => escapeRx(path.relative(examplesDir, require.resolve(p)).replace(/\\/g,'/'))
  pjs.forEach(pj => {
    let dir = pj.replace(/\/package\.json$/, '')
    examples.push(moduleFriendly(dir))
  })
  let pathsRegex = paths => new RegExp(paths.length ? paths.join('$|').concat('$') : '.^')
  return {examplesDir, examplesRegex: pathsRegex(examples)}
}

function escapeRx(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
