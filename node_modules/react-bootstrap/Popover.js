"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireDefault(require("react"));

var _isRequiredForA11y = _interopRequireDefault(require("prop-types-extra/lib/isRequiredForA11y"));

var _ThemeProvider = require("./ThemeProvider");

var _PopoverTitle = _interopRequireDefault(require("./PopoverTitle"));

var _PopoverContent = _interopRequireDefault(require("./PopoverContent"));

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
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["bsPrefix", "innerRef", "placement", "className", "style", "children", "content", "arrowProps", "scheduleUpdate", "outOfBoundaries"]);
  return _react.default.createElement("div", (0, _extends2.default)({
    role: "tooltip",
    ref: innerRef,
    style: style,
    "x-placement": placement,
    className: (0, _classnames.default)(className, bsPrefix, "bs-popover-" + placement)
  }, props), _react.default.createElement("div", (0, _extends2.default)({
    className: "arrow"
  }, arrowProps)), content ? _react.default.createElement(_PopoverContent.default, null, children) : children);
}

Popover.defaultProps = defaultProps;
var DecoratedPopover = (0, _ThemeProvider.createBootstrapComponent)(Popover, 'popover');
DecoratedPopover.Title = _PopoverTitle.default;
DecoratedPopover.Content = _PopoverContent.default;
var _default = DecoratedPopover;
exports.default = _default;
module.exports = exports["default"];