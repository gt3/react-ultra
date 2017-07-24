import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { spec, check, match, prefixMatch, appendPath, parseQS } from 'ultra'
import { A } from '../../src'

function pipe(...fns) {
  function invoke(v) {
    return fns.reduce((acc, fn) => (fn ? fn.call(this, acc) : acc), v)
  }
  return invoke
}

let createMatch = (select, staticPathKey) => {
  let transform = ({ values: [x] }) => ({ x })
  return [prefixMatch(staticPathKey, match(spec('/:x')(pipe(transform, select))))]
}

class App extends Component {
  constructor(props, ctx) {
    super(props, ctx)
    App.pathKey = props.pathKey
    this.state = { x: 1, tap: false }
    this.navigate = this.navigate.bind(this)
  }
  get nextLink() {
    return `${App.pathKey}/${+this.state.x + 1}`
  }
  navigate() {
    return this.context.getUltra().push(this.nextLink)
  }
  componentDidMount() {
    let matchers = createMatch(this.setState.bind(this), App.pathKey)
    this.remove = this.context.run(curr => [...matchers, ...curr], this.props.runUltra)
    this.interval = setInterval(this.navigate, 3000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
    this.remove()
  }
  confirm(ok, cancel) {
    return window.confirm('Are you sure you want to navigate away?') ? ok() : cancel()
  }
  render() {
    let { x, tap } = this.state, { getUltra } = this.context
    let toggleTap = cb => () => this.setState(state => ({ tap: !state.tap }), cb)
    if (tap) getUltra().tap((ok, cancel) => this.confirm(toggleTap(ok), cancel))
    else getUltra().untap()
    return (
      <button onClick={toggleTap()}>
        {tap ? 'release' : 'tap'}: {x}
      </button>
    )
  }
}
App.contextTypes = { getUltra: PropTypes.func, run: PropTypes.func }
// export default (node, pathKey, services) => {
//   Object.assign(App, services, { pathKey })
//   let placeholder = toggle(emptyMatch, pathKey)
//   services.runUltra(curr => [...curr, placeholder])
//   //return (msg, cb) => render(<App />, node, cb)
//   return (msg, cb) =>
//     render(
//       <div>
//         <hr />
//         <div dangerouslySetInnerHTML={{ __html: readme }} />
//         <App />
//       </div>,
//       node,
//       cb
//     )
// }
export default (pathKey, msg) =>
  <div>
    <hr />
    <div dangerouslySetInnerHTML={{ __html: readme }} />
    <App pathKey={pathKey} runUltra={msg && msg.path !== pathKey} />
  </div>

var readme = require('./README.md')
