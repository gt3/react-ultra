import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { Anchor } from 'ultra'

export function Anchor(props, ctx) {
	return <Anchor getUltra={() => ctx.services.ultra} {...props}  />
}
Anchor.defaultProps = { createElement: React.createElement, retain: 'qs' }
Anchor.contextTypes = { services: PropTypes.object }
