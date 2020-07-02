import UnprefixedReact from 'react'
import classnames from 'classnames/bind'

export default function cx(styles, prop='cx') {
  const bound = classnames.bind(styles)

  function getProps(props) {
    if (!props) return props

    if (props.cx) {
      const result = Object.assign({}, props)
      delete result.cx
      const args = Array.isArray(props.cx) ? props.cx : [props.cx]
      result.className = bound(...args)
      if (props.className) result.className += ' '+props.className
      return result
    }
    return props
  }
  function createElement(type, props, ...children) {
    return UnprefixedReact.createElement(type, getProps(props), ...children)
  }
  function cloneElement(element, props, ...children) {
    return UnprefixedReact.cloneElement(element, getProps(props), ...children)
  }
  return Object.assign({}, UnprefixedReact, {
    createElement,
    cloneElement
  })
}
