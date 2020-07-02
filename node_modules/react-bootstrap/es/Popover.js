import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React from 'react';
import isRequiredForA11y from 'prop-types-extra/lib/isRequiredForA11y';
import { createBootstrapComponent } from './ThemeProvider';
import PopoverTitle from './PopoverTitle';
import PopoverContent from './PopoverContent';
var defaultProps = {
  placement: 'right'
};

function Popover(_ref) {
  var bsPrefix = _ref.bsPrefix,
      innerRef = _ref.innerRef,
      placement = _ref.placement,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children,
      content = _ref.content,
      arrowProps = _ref.arrowProps,
      _ = _ref.scheduleUpdate,
      _1 = _ref.outOfBoundaries,
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "innerRef", "placement", "className", "style", "children", "content", "arrowProps", "scheduleUpdate", "outOfBoundaries"]);

  return React.createElement("div", _extends({
    role: "tooltip",
    ref: innerRef,
    style: style,
    "x-placement": placement,
    className: classNames(className, bsPrefix, "bs-popover-" + placement)
  }, props), React.createElement("div", _extends({
    className: "arrow"
  }, arrowProps)), content ? React.createElement(PopoverContent, null, children) : children);
}

Popover.defaultProps = defaultProps;
var DecoratedPopover = createBootstrapComponent(Popover, 'popover');
DecoratedPopover.Title = PopoverTitle;
DecoratedPopover.Content = PopoverContent;
export default DecoratedPopover;