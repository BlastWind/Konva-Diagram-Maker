import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import React, { useContext } from 'react';
import BaseDropdownMenu from 'react-overlays/DropdownMenu';
import NavbarContext from './NavbarContext';
import { useBootstrapPrefix } from './ThemeProvider';

var wrapRef = function wrapRef(props) {
  var ref = props.ref;

  props.ref = ref.__wrapped || (ref.__wrapped = function (r) {
    return ref(findDOMNode(r));
  });

  return props;
};

var defaultProps = {
  alignRight: false,
  flip: true
};
var DropdownMenu = React.forwardRef(function (_ref, ref) {
  var bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      alignRight = _ref.alignRight,
      rootCloseEvent = _ref.rootCloseEvent,
      flip = _ref.flip,
      popperConfig = _ref.popperConfig,
      showProps = _ref.show,
      _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'div' : _ref$as,
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "className", "alignRight", "rootCloseEvent", "flip", "popperConfig", "show", "as"]);

  var isNavbar = useContext(NavbarContext);
  var prefix = useBootstrapPrefix(bsPrefix, 'dropdown-menu');
  return React.createElement(BaseDropdownMenu, {
    ref: ref // FIXME: the ref situation is out of hand here
    ,
    flip: flip,
    show: showProps,
    alignEnd: alignRight,
    usePopper: !isNavbar,
    popperConfig: popperConfig,
    rootCloseEvent: rootCloseEvent
  }, function (_ref2) {
    var placement = _ref2.placement,
        show = _ref2.show,
        alignEnd = _ref2.alignEnd,
        close = _ref2.close,
        menuProps = _ref2.props;
    wrapRef(menuProps); // For custom components provide additional, non-DOM, props;

    if (typeof Component !== 'string') {
      menuProps.show = show;
      menuProps.close = close;
      menuProps.alignRight = alignEnd;
    }

    var style = props.style;

    if (placement) {
      // we don't need the default popper style,
      // menus are display: none when not shown.
      style = _extends({}, style, {}, menuProps.style);
      props['x-placement'] = placement;
    }

    return React.createElement(Component, _extends({}, props, menuProps, {
      style: style,
      className: classNames(className, prefix, show && 'show', alignEnd && prefix + "-right")
    }));
  });
});
DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.defaultProps = defaultProps;
export default DropdownMenu;