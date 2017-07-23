import { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { a, container } from 'ultra'

const A = props => createElement(a.link, props)
const _id = x => x
const exclude = (ex, source) => source === ex ? [] : source.filter(s => ex.indexOf(s) === -1)

export default class Ultra extends Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.ultra = props.ultra
    this.run = this.run.bind(this)
  }
  run(getMatchers, dispatch = false, getMismatchers = _id) {
    let {matchers = [], mismatchers = []} = this.ultra || {}
    let newMatchers = getMatchers(matchers)
    let newMismatchers = getMismatchers(mismatchers)
    this.ultra = container(newMatchers, newMismatchers, this.ultra, dispatch)
    return this.remove.bind(this, exclude(matchers, newMatchers), exclude(mismatchers, newMismatchers))
  }
  remove(matchers, mismatchers) {
    this.run(exclude.bind(null, matchers), false, exclude.bind(null, mismatchers))
  }
  getChildContext() {
    A.defaultProps = { createElement, getUltra: () => this.ultra }
    return { A, run: this.run }
  }
  render() {
    return Children.only(this.props.children)
  }
}
Ultra.propTypes = {
  ultra: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}
Ultra.childContextTypes = {
  A: PropTypes.func,
  run: PropTypes.func
}

