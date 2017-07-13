import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
import { a, spec, match, prefixMatch, toggleSelected, container } from 'ultra'
require('./sakura.css')

let _ultra, getUltra = () => _ultra, A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra }

let runUltra = (getMatchers, dispatchCurrent = false) => 
_ultra = container(getMatchers(_ultra ? _ultra.matchers : []), null, _ultra, dispatchCurrent);

let replaceMatchers = (key, replacements) => {
  runUltra(curr => toggleSelected(curr, key, replacements))
}
let services = {getUltra, runUltra, replaceMatchers, a: A}

let createAppElement = (d, readme) => {
  let appDiv = d.createElement('div')
  return d.body.insertBefore(appDiv, null)
}
let tocElem = createAppElement(document)
let toc = examples.map(([pathKey]) => <li key={pathKey}><A href={'/' + pathKey}>{pathKey}</A></li>)
let TOC = () => <ul>{toc}</ul>
let renderTOC = () => render(<TOC />, tocElem)

let exampleElem = createAppElement(document)
let exampleSpecs = examples.map(([pathKey, app, readme]) => {
  pathKey = `/${pathKey}`
  let renderApp = app(exampleElem, pathKey, services)
  return spec(pathKey)(renderApp, msg => renderApp(msg, () => _ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderTOC))

runUltra(curr => [...curr, match(exampleSpecs)], true)
