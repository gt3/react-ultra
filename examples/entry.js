import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import examples from './requireExamples'
import { spec, match } from 'ultra'
import { A, Ultra, Use } from '../src/index'
require('./sakura.css')

let examplesMatch,
  rootMatch,
  root = document.getElementById('root')

let TocLinks = props =>
  examples.map(([mountPath]) =>
    <li key={mountPath}>
      <A href={'/' + mountPath}>
        {mountPath}
      </A>
    </li>
  )

let renderRoot = (app, msg) =>
  render(
    <Ultra matchers={rootMatch} dispatch={false}>
      <div>
        <Use matchers={examplesMatch} />
        <ul>
          <TocLinks />
        </ul>
        <div>
          {app && app(msg)}
        </div>
      </div>
    </Ultra>,
    root
  )

rootMatch = match(spec('/')(msg => renderRoot(null, msg)))

examplesMatch = match(
  examples.map(([mountPath, app]) => {
    mountPath = `/${mountPath}`
    app = app.bind(null, mountPath)
    return spec(mountPath)(renderRoot.bind(null, app)) //, msg => render(msg, () => msg.ultra.replace(msg.path)))
  })
)

renderRoot()
