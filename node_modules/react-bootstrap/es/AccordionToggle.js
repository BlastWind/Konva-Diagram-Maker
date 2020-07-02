import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import React from 'react';
import useAccordionToggle from './useAccordionToggle';
var AccordionToggle = React.forwardRef(function (_ref, ref) {
  var _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'button' : _ref$as,
      children = _ref.children,
      eventKey = _ref.eventKey,
      onClick = _ref.onClick,
      props = _objectWithoutPropertiesLoose(_ref, ["as", "children", "eventKey", "onClick"]);

  var accordionOnClick = useAccordionToggle(eventKey, onClick);
  return React.createElement(Component, _extends({
    ref: ref,
    onClick: accordionOnClick
  }, props), children);
});
export default AccordionToggle;