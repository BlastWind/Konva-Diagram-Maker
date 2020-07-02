react-cx
========

[![Version](http://img.shields.io/npm/v/react-cx.svg)](https://www.npmjs.org/package/react-cx)

Add styles from CSS Modules with a `cx` prop:

```jsx
<div
  cx={['Arrow', { active }, color, 'length-'+length]}
  className={className}
 />
```

Inspired by [jareware/css-ns](https://github.com/jareware/css-ns). Uses [jedwatson/classnames](https://github.com/JedWatson/classnames) under the hood.

Install with npm:

```sh
# Adds react-cx to node_modules and package.json
npm install react-cx --save
```


Why?
----

When styling components with [CSS modules](https://github.com/css-modules/css-modules), you'll often need join multiple class names together before passing them to the React `className` prop.

```jsx
// CSS Modules provide an object with your stylesheet's class names
import styles from './Theme.less'

export function({ active, className, color, length=1 }) {
  const className = `
    ${styles.Arrow}
    ${active ? styles.active : ''}
    ${styles[color] || ''}
    ${styles['length-+'length] || ''}
    ${className}
  `
  <div className={className} />
}
```

The [classnames](https://github.com/JedWatson/classnames) package can help, but the resulting code still feels a little verbose after you've typed it for the 50th time.

```jsx
import styles from './Theme.less'

// classnames provides a helper to build `className` strings
import bindClassNames from 'classnames/bind'
const cx = bindClassNames(styles)

export function Arrow({ active, className='', color, length=1 }) {
  return <div className={cx('Arrow', { active }, color, 'length-'+length)+' '+className} />
}
```

With react-cx, you can add styles from your CSS modules directly to your elements by using the `cx` prop. It uses the same syntax as the classnames package, and still lets you append a raw `className` prop.

```jsx
import styles from './Theme.less'

// react-cx adds a `cx` prop to React by wrapping `React.createElement`
import getReactWithCX from './react-cx'
const React = getReactWithCX(styles)

export function Arrow({ active, className, color, length=1 }) {
  return (
    <div
      cx={['Arrow', { active }, color, 'length-'+length]}
      className={className}
     />
  )
}
```

Of course, the `cx` prop can also accept strings or plain objects:

```jsx
export function Switch({ active, className, color='lifecycle', direction='down' }) {
  return (
    <div cx={['Switch', { active }, color, direction]} className={className}>
      <div cx="pivot" />
      <Arrow active={active} color={color} />
    </div>
  )
}
```

*These components are taken from my [React lifecycle simulators](https://reactarmory.com/guides/lifecycle-simulators).*


How does it work?
-----------------

In React, JSX calls are translated to calls to `React.createElement()`. Thus, by wrapping `React.createElement()` with our own function, we can add support for new props without ever touching React's internals.

If you understand how `React.createElement()` works, the easiest way to grok this is to just view the source below. If you're not yet familiar with `React.createElement()`, head over to [React Armory](https://reactarmory.com/guides/learn-react-by-itself/react-basics) for a simple explanation with live examples and exercises.

```js
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
```


More examples
-------------

These components are all taken from my [React lifecycle simulators](https://reactarmory.com/guides/lifecycle-simulators).

```jsx
export function Indicator({ active, className, color, icon, label, noMobile, scheduled, style }) {
  return (
    <div cx={['Indicator', (scheduled || active) && color, { active, 'no-mobile': noMobile }]} className={className} style={style}>
      { icon &&
        <div cx="icon">{icon}</div>
      }
      <div cx="label">{label}</div>
    </div>
  )
}

export function Switch({ active, className, color='lifecycle', direction='down', style }) {
  return (
    <div cx={['Switch', { active }, color, direction]} className={className} style={style}>
      <div cx="pivot" />
      <Arrow active={active} color={color} headless={direction === 'down'} />
    </div>
  )
}

function SwitchedSetter({ className, color, icon, label, noMobile, setActive, style, switchActive, willSet }) {
  return (
    <div cx={['SwitchedSetter', { 'no-mobile': noMobile }]} className={className} style={style}>
      <Switch active={switchActive} direction={willSet ? 'right' : 'down' } />
      <Indicator active={setActive} color={color} icon={icon} label={label} scheduled={willSet} />
      <Arrow cx='horizontal-wire' active={setActive} color={color} headless length={4} />
      <Arrow cx='vertical-wire' active={setActive} color={color} headless />
      <Arrow cx='output' active={setActive || (switchActive && !willSet)} color={switchActive ? 'lifecycle' : color} />
    </div>
  )
}
```


License
-------

[MIT](/LICENSE) Copyright &copy; 2017 James K Nelson