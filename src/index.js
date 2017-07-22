import { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { a, container, toggleSelected } from 'ultra'

const A = props => createElement(a.link, props)
const _id = x => x

class Ultra extends Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.ultra = props.ultra
    this.run = this.run.bind(this)
    //this.toggle = this.toggle.bind(this)
    this.remove = this.remove.bind(this)
  }
  run(getMatchers, getMismatchers = _id, dispatch = false) {
    let {matchers = [], mismatchers = []} = this.ultra || {}
    this.ultra = container(getMatchers(matchers), getMismatchers(mismatchers), this.ultra, dispatch)
    return this.ultra
  }
  remove(key) {
    return this.run(curr => curr.filter(k => k !== key))
  }
  toggle(key, matchers) {
    return this.run(curr => toggleSelected(curr, key, matchers))
  }
  getChildContext() {
    A.defaultProps = { createElement, getUltra: () => this.ultra }
    let { ultra, run, remove } = this
    return { A, ultra, run, remove }
  }
  render() {
    return Children.only(this.props.children)
  }
}
Ultra.propTypes = {
  ultra: Proptypes.object.isRequired,
  children: PropTypes.element.isRequired
}
Ultra.childContextTypes = {
  A: Proptypes.element,
  ultra: Proptypes.object
}

module.exports = { Ultra }
