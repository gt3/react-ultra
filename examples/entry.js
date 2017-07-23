import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import examples from './requireExamples'
import { spec, match, container } from 'ultra'
import Ultra from '../src/index'
require('./sakura.css')

let _ultra, root = document.getElementById('root')

let TocLinks = (props, {A}) => examples.map(([pathKey]) =>
  <li key={pathKey}>
    <A href={'/' + pathKey}>
      {pathKey}
    </A>
  </li>
)
TocLinks.contextTypes = { A: PropTypes.func }

let renderRoot = (app, msg) => render(
  <Ultra ultra={_ultra}>
    <div>
      <ul><TocLinks /></ul>
      <div>{app && app(msg)}</div>
    </div>
  </Ultra>
, root)

let exampleSpecs = examples.map(([pathKey, app]) => {
  pathKey = `/${pathKey}`
  let render = renderRoot.bind(null, app.bind(null, pathKey))
  return spec(pathKey)(render) //, msg => render(msg, () => msg.ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderRoot.bind(null, null)))

_ultra = container(match(exampleSpecs), null, null, true)