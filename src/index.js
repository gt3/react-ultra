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
    return { getUltra: () => this.ultra, run: this.run }
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
  getUltra: PropTypes.func,
  run: PropTypes.func
}

export { Ultra, A }