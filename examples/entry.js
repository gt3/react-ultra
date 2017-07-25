import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import examples from './requireExamples'
import { spec, match, container } from 'ultra'
import { A, Ultra, Use } from '../src/index'
require('./sakura.css')

let renderRoot, root = document.getElementById('root')

let TocLinks = (props) => examples.map(([mountPath]) =>
  <li key={mountPath}>
    <A href={'/' + mountPath}>
      {mountPath}
    </A>
  </li>
)

let examplesMatch = () => {
  let exampleSpecs = examples.map(([mountPath, app]) => {
    mountPath = `/${mountPath}`
    let render = renderRoot.bind(null, app.bind(null, mountPath))
    return spec(mountPath)(render) //, msg => render(msg, () => msg.ultra.replace(msg.path)))
  })
  return match(exampleSpecs)
}

let rootMatch = () => match(spec('/')(msg => renderRoot(null, msg)))

renderRoot = (app, msg) => render(
  <Ultra matchers={rootMatch()} dispatch={false} >
    <div>
      <Use matchers={examplesMatch()} />
      <ul><TocLinks /></ul>
      <div>{app && app(msg)}</div>
    </div>
  </Ultra>
, root)

_ultra = container(match(exampleSpecs), null, null, true)