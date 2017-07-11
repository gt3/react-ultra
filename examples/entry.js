import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
import { a, spec, match, prefixMatch, container } from 'ultra'
require('./sakura.css')

let _ultra, A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra: () => _ultra }

let createAppElement = (d, readme) => {
  let appDiv = d.createElement('div')
  return d.body.insertBefore(appDiv, null)
}
let tocElem = createAppElement(document)
let toc = examples.map(([pathKey]) => <li key={pathKey}><A href={'/' + pathKey}>{pathKey}</A></li>)
let TOC = () => <ul>{toc}</ul>
let renderTOC = () => render(<TOC />, tocElem, runUltra)

let exampleElem = createAppElement(document)
let exampleSpecs = examples.map(([pathKey, app, readme]) => {
  //let elem  = createAppElement(document, readme)
  return spec(`/${pathKey}`)(() => app(exampleElem, runUltra(), readme))
})
exampleSpecs.push(spec('/')(renderTOC))

let runUltra = () => _ultra = container(match(exampleSpecs), null, _ultra, false);

renderTOC()