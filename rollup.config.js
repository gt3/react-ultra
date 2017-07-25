import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { minify } from 'uglify-es'
import uglify from 'rollup-plugin-uglify'
const compress = process.env.DIST === 'true'
const babelPlugin = babel({exclude: 'node_modules/**', plugins: ["external-helpers"]})

const lib = {
  entry: './src/index.js',
  globals: { 'react': 'React', 'prop-types': 'PropTypes', 'ultra': 'ultra' },
  external: ['react', 'prop-types', 'ultra'],
  plugins: [
    babelPlugin,
    resolve({}),
    commonjs({})
  ],
  targets: [
    { format: 'es', dest: './lib/react-ultra.es.js' },
    { format: 'umd', dest: './lib/react-ultra.js', moduleName: 'reactUltra' }
  ]
}

const dist = Object.assign({}, lib, {
  plugins: [
    ...lib.plugins,
    uglify({}, minify)
  ],
  targets: [
    { format: 'umd', dest: './dist/react-ultra.min.js', moduleName: 'reactUltra' }
  ]
})

export default compress ? dist: lib
