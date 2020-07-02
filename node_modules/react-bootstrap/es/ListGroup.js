import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React from 'react';
import { useUncontrolled } from 'uncontrollable';
import { useBootstrapPrefix } from './ThemeProvider';
import AbstractNav from './AbstractNav';
import ListGroupItem from './ListGroupItem';
var defaultProps = {
  variant: null
};
var ListGroup = React.forwardRef(function (props, ref) {
  var _useUncontrolled = useUncontrolled(props, {
    activeKey: 'onSelect'
  }),
      className = _useUncontrolled.className,
      bsPrefix = _useUncontrolled.bsPrefix,
      variant = _useUncontrolled.variant,
      _useUncontrolled$as = _useUncontrolled.as,
      as = _useUncontrolled$as === void 0 ? 'div' : _useUncontrolled$as,
      controlledProps = _objectWithoutPropertiesLoose(_useUncontrolled, ["className", "bsPrefix", "variant", "as"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'list-group');
  return React.createElement(AbstractNav, _extends({
    ref: ref
  }, controlledProps, {
    as: as,
    className: classNames(className, bsPrefix, variant && bsPrefix + "-" + variant)
  }));
});
ListGroup.defaultProps = defaultProps;
ListGroup.displayName = 'ListGroup';
ListGroup.Item = ListGroupItem;
export default ListGroup;