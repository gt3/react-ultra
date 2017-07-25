import React, { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { a, container } from 'ultra'

const A = (props, { getUltra }) => <a.link getUltra={getUltra} {...props} />
A.defaultProps = { createElement }
A.contextTypes = { getUltra: PropTypes.func }

const _id = x => x
const exclude = (ex, source) => (source === ex ? [] : source.filter(s => ex.indexOf(s) === -1))

class Ultra extends Component {
  clone(getMatchers, getMismatchers = _id, dispatch) {
    let { matchers = [], mismatchers = [] } = this.ultra || {}
    let newMatchers = getMatchers(matchers)
    let newMismatchers = getMismatchers(mismatchers)
    this.ultra = container(newMatchers, newMismatchers, this.ultra, dispatch)
    return this.remove.bind(
      this,
      exclude(matchers, newMatchers),
      exclude(mismatchers, newMismatchers)
    )
  }
  remove(matchers, mismatchers) {
    this.clone(exclude.bind(null, matchers), exclude.bind(null, mismatchers), false)
  }
  componentWillMount() {
    let { matchers, mismatchers, dispatch } = this.props
    this.ultra = container(matchers, mismatchers, null, dispatch)
  }
  componentWillUnmount() {
    if (this.ultra) this.ultra.stop()
  }
  getChildContext() {
    return { getUltra: () => this.ultra, clone: this.clone.bind(this) }
  }
  render() {
    return Children.only(this.props.children)
  }
}
Ultra.propTypes = {
  children: PropTypes.element.isRequired,
  matchers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  mismatchers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  dispatch: PropTypes.bool
}
Ultra.childContextTypes = {
  getUltra: PropTypes.func,
  clone: PropTypes.func
}

class Use extends Component {
  componentWillMount() {
    let matchers = [].concat(this.props.matchers)
    let mismatchers = [].concat(this.props.mismatchers || [])
    let addMatchers = curr => (this.props.append ? [...curr, ...matchers] : [...matchers, ...curr])
    let addMismatchers = curr => [...curr, ...mismatchers]
    this.remove = this.context.clone(addMatchers, addMismatchers, this.props.dispatch)
  }
  componentWillUnmount() {
    this.remove()
  }
  render() {
    return null
  }
}
Use.propTypes = {
  matchers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  mismatchers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  dispatch: PropTypes.bool,
  append: PropTypes.bool
}
Use.contextTypes = { clone: PropTypes.func }

export { Ultra, Use, A }
