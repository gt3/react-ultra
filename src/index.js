import { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { a } from 'ultra'

const A = props => <a.link {...props} />

export default class Ultra extends Component {
  getChildContext() {
    A.defaultProps = { createElement, getUltra: () => this.props.ultra }
    return { A, ultra: this.props.ultra }
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

