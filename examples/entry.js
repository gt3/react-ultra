import React from 'react'
import { render } from 'react-dom'
import examples from './requireExamples'
//import { a, spec, match, prefixMatch, toggleSelected, container } from 'ultra'
import { Ultra } from '../src'
require('./sakura.css')

let _ultra, root = document.getElementById('root')

let TocLinks = (props, {A}) => examples.map(([pathKey]) =>
  <li key={pathKey}>
    <A href={'/' + pathKey}>
      {pathKey}
    </A>
  </li>
)
TocLinks.contextTypes = { A: PropTypes.element }

let renderRoot = (app, msg, cb) => render(
  <Ultra ultra={_ultra}>
    <div><ul><TocLinks /></ul></div>
    <div>{app && app(msg)}</div>
  </Ultra>
, root, cb)

let exampleSpecs = examples.map(([pathKey, app]) => {
  pathKey = `/${pathKey}`
  let render = renderRoot.bind(null, app.bind(null, pathKey))
  return spec(pathKey)(render, msg => render(msg, () => msg.ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderRoot))

_ultra = container(match(exampleSpecs), null, null, true)