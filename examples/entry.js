import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import examples from './examples' //'./requireExamples'
import { spec, match } from 'ultra'
import { A, Ultra, Use } from '../src/index'

let examplesMatch,
  rootMatch,
  root = document.getElementById('root')

let TocLinks = props =>
  examples.map(({mountDir}) =>
    <li key={mountDir}>
      <A href={'/' + mountDir}>
        {mountDir}
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
  examples.map(({mountDir, app}) => {
    mountDir = `/${mountDir}`
    app = app.bind(null, mountDir)
    return spec(mountDir)(renderRoot.bind(null, app)) //, msg => render(msg, () => msg.ultra.replace(msg.path)))
  })
)

renderRoot()
