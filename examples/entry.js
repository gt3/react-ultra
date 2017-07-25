import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import examples from './requireExamples'
import { spec, match, container } from 'ultra'
import { A, Ultra } from '../src/index'
require('./sakura.css')

let _ultra, root = document.getElementById('root')

let TocLinks = (props) => examples.map(([mountPath]) =>
  <li key={mountPath}>
    <A href={'/' + mountPath}>
      {mountPath}
    </A>
  </li>
)

let renderRoot = (app, msg) => render(
  <Ultra ultra={_ultra}>
    <div>
      <ul><TocLinks /></ul>
      <div>{app && app(msg)}</div>
    </div>
  </Ultra>
, root)

let exampleSpecs = examples.map(([mountPath, app]) => {
  mountPath = `/${mountPath}`
  let render = renderRoot.bind(null, app.bind(null, mountPath))
  return spec(mountPath)(render) //, msg => render(msg, () => msg.ultra.replace(msg.path)))
})
exampleSpecs.push(spec('/')(renderRoot.bind(null, null)))

_ultra = container(match(exampleSpecs), null, null, true)