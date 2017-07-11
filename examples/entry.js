import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
import { a, spec, match, prefixMatch, toggleSelected, container } from 'ultra'
require('./sakura.css')

let _ultra, A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra: () => _ultra }

let runUltra = (getMatchers, dispatchCurrent = false) => 
_ultra = container(getMatchers(_ultra ? _ultra.matchers : []), null, _ultra, dispatchCurrent);

let replaceMatchers = (key, replacements) => {
  runUltra(curr => toggleSelected(curr, key, replacements))
}


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
  return spec(pathKey)(app(exampleElem, runUltra, replaceMatchers, A, pathKey))
})
exampleSpecs.push(spec('/')(renderTOC))

runUltra(curr => [...curr, match(exampleSpecs)], true)
