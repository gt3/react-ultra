import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
//import { a, spec, match, prefixMatch, toggleSelected, container } from 'ultra'
import { Ultra } from '../src'
require('./sakura.css')

let root = document.getElementById('root')
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
let renderTOC = () => render(
  <Ultra ultra={container()}>
    <div><TOC /></div>
    <div></div>
  </Ultra>
, root)

let exampleSpecs = examples.map(([pathKey, app]) => {
  pathKey = `/${pathKey}`
  let renderApp = app(pathKey)
  return spec(pathKey)(renderApp, msg => renderApp(msg, () => _ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderTOC))

runUltra(curr => [...curr, match(exampleSpecs)], true)
