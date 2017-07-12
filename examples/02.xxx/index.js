import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { spec, check, match, prefixMatch, appendPath, parseQS } from 'ultra'

let App = props => <div>
    <p>{props.label}</p>
    <App.a href={App.pathKey + '/a'}>a-link</App.a>
  </div>

let _renderApp = node => label => render(<App label={label} />, node)

export default (node, runUltra, replaceMatchers, A, pathKey) => {
  App.a = A
  App.pathKey = pathKey
  let renderApp = _renderApp(node)
  let amatch = prefixMatch(pathKey, match(spec('/a')(() => renderApp('aaa'))))
  runUltra(curr => [...curr, amatch])
  return () => renderApp('xxx')
}