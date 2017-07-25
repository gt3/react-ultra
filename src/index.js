import React, { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { a, container } from 'ultra'

const A = (props, { getUltra }) => <a.link getUltra={getUltra} {...props} />
A.defaultProps = { createElement }
A.contextTypes = { getUltra: PropTypes.func }

const _id = x => x
const exclude = (ex, source) => source === ex ? [] : source.filter(s => ex.indexOf(s) === -1)

class Ultra extends Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.ultra = props.ultra
    this.run = this.run.bind(this)
  }
  run(getMatchers, getMismatchers = _id, dispatch = false) {
    let {matchers = [], mismatchers = []} = this.ultra || {}
    let newMatchers = getMatchers(matchers)
    let newMismatchers = getMismatchers(mismatchers)
    this.ultra = container(newMatchers, newMismatchers, this.ultra, dispatch)
    return this.remove.bind(this, exclude(matchers, newMatchers), exclude(mismatchers, newMismatchers))
  }
  remove(matchers, mismatchers) {
    this.run(exclude.bind(null, matchers), exclude.bind(null, mismatchers), false)
  }
  componentWillMount() {
    this.props.init(this.run)
  }
  getChildContext() {
    return { getUltra: () => this.ultra, run: this.run }
  }
  render() {
    return Children.only(this.props.children)
  }
}
Ultra.propTypes = {
  init: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
}
Ultra.childContextTypes = {
  getUltra: PropTypes.func,
  run: PropTypes.func
}

class Use extends Component {
  componentWillMount() {
    let add = this.props.append
      ? curr => [...curr, ...this.props.matchers]
      : curr => [...this.props.matchers, ...curr]
    this.remove = this.context.run(add, this.props.dispatch)
  }
  componentWillUnmount() {
    this.remove()
  }
  render() {
    return null
  }
}
Use.propTypes = {
  matchers: PropTypes.array.isRequired,
  dispatch: PropTypes.bool,
  append: PropTypes.bool
}
Use.contextTypes = { run: PropTypes.func }

export { Ultra, Use, A }
