import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
import { a, spec, match, prefixMatch, container } from 'ultra'
require('./sakura.css')

let _ultra, A = props => <a.link {...props} />
A.defaultProps = { createElement: React.createElement, getUltra: () => _ultra }

let createAppElement = (d, readme) => {
  let appDiv = d.createElement('div'),
    rDiv = d.createElement('div')
  rDiv.innerHTML = readme ? readme : ''
  d.body.appendChild(rDiv)
  let seperator = d.body.appendChild(d.createElement('hr'))
  return d.body.insertBefore(appDiv, seperator)
}
let tocElem = createAppElement(document)
let TOC = () => examples.map(([pathKey]) => <A href={'/' + pathKey}>{pathKey}</A>)

let exampleSpecs = examples.map(([pathKey, app, readme]) => {
  let elem = createAppElement(document, readme)
  return spec(`/${pathKey}`)(app.bind(null, elem, A))
})
//exampleSpecs.push(spec('/', toc))
let runUltra = () => _ultra = container(match(exampleSpecs, null, _ultra, false));

render(<TOC examples/>, tocElem, runUltra)