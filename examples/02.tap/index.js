import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { spec, check, match, prefixMatch, toggle, appendPath, parseQS } from 'ultra'

let emptyMatch = match({})

function pipe(...fns) {
  function invoke(v) {
    return fns.reduce((acc, fn) => (fn ? fn.call(this, acc) : acc), v)
  }
  return invoke
}

let createMatch = (select, staticPathKey) => {
  let transform = ({ values: [x] }) => ({x})
  return [
    prefixMatch(staticPathKey, match(spec('/:x')(pipe(transform, select))))
  ]
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { x: 1, tap: false }
    this.navigate = this.navigate.bind(this)
    this.toggleTap = this.toggleTap.bind(this)
  }
  get nextLink() {
    return `${App.pathKey}/${+this.state.x+1}`
  }
  navigate() {
    return App.getUltra().push(this.nextLink)
  }
  componentDidMount() {
    let matchers = createMatch(this.setState.bind(this), App.pathKey)
    App.replaceMatchers(App.pathKey, matchers)
    setInterval(this.navigate, 3000)
  }
  componentWillUnmount() {
    let placeholder = toggle(emptyMatch, App.pathKey)
    App.replaceMatchers(App.pathKey, [placeholder])
  }
  toggleTap() {
    this.setState(state => ({ tap: !state.tap }))
  }
	confirm(ok, cancel) {
		return window.confirm('Are you sure you want to navigate away?') ? ok() : cancel()
	}
  render() {
    let {x, tap} = this.state
		if(tap) App.getUltra().tap(this.confirm)
		else App.getUltra().untap()
    return (
      <div>
        <App.a href={App.pathKey + '/' + x}>increment</App.a>
        <button onClick={this.toggleTap}>{ tap ? 'release' : 'tap' }</button>
      </div>
    )
  }
}

export default (node, pathKey, services) => {
  Object.assign(App, services, { pathKey })
  let placeholder = toggle(emptyMatch, pathKey)
  services.runUltra(curr => [...curr, placeholder])
  return (msg, cb) => render(<App />, node, cb)
}
