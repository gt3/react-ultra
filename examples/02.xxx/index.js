import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { a, spec, check, match, prefixMatch, container, appendPath, parseQS } from 'ultra'

let App = () => {
  return <p>02.xxx app</p>
}

export default (node, runUltra) => render(<App />, node)
