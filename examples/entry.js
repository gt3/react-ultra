import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
import { a, spec, match, prefixMatch, toggleSelected, container } from 'ultra'
require('./sakura.css')

let _ultra,
  getUltra = () => _ultra,
  A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra }

let runUltra = (getMatchers, dispatchCurrent = false) =>
  (_ultra = container(getMatchers(_ultra ? _ultra.matchers : []), null, _ultra, dispatchCurrent))

let replaceMatchers = (key, replacements) => {
  runUltra(curr => toggleSelected(curr, key, replacements))
}
let services = { getUltra, runUltra, replaceMatchers, a: A }

let insertDiv = () => {
  let appDiv = document.createElement('div')
  return document.body.insertBefore(appDiv, null)
}
let tocDiv = insertDiv()
let toc = examples.map(([pathKey]) =>
  <li key={pathKey}>
    <A href={'/' + pathKey}>
      {pathKey}
    </A>
  </li>
)
let TOC = () =>
  <ul>
    {toc}
  </ul>
let renderTOC = () => render(<TOC />, tocDiv)

let exampleDiv = insertDiv()
let exampleSpecs = examples.map(([pathKey, app]) => {
  pathKey = `/${pathKey}`
  let renderApp = app(exampleDiv, pathKey, services)
  return spec(pathKey)(renderApp, msg => renderApp(msg, () => _ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderTOC))

runUltra(curr => [...curr, match(exampleSpecs)], true)
