"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactDom = require("react-dom");

var _react = _interopRequireWildcard(require("react"));

var _DropdownMenu = _interopRequireDefault(require("react-overlays/DropdownMenu"));

var _NavbarContext = _interopRequireDefault(require("./NavbarContext"));

var _ThemeProvider = require("./ThemeProvider");

var wrapRef = function wrapRef(props) {
  var ref = props.ref;

  props.ref = ref.__wrapped || (ref.__wrapped = function (r) {
    return ref((0, _reactDom.findDOMNode)(r));
  });

  return props;
};

var defaultProps = {
  alignRight: false,
  flip: true
};

var DropdownMenu = _react.default.forwardRef(function (_ref, ref) {
  var bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      alignRight = _ref.alignRight,
      rootCloseEvent = _ref.rootCloseEvent,
      flip = _ref.flip,
      popperConfig = _ref.popperConfig,
      showProps = _ref.show,
      _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'div' : _ref$as,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["bsPrefix", "className", "alignRight", "rootCloseEvent", "flip", "popperConfig", "show", "as"]);
  var isNavbar = (0, _react.useContext)(_NavbarContext.default);
  var prefix = (0, _ThemeProvider.useBootstrapPrefix)(bsPrefix, 'dropdown-menu');
  return _react.default.createElement(_DropdownMenu.default, {
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
      style = (0, _extends2.default)({}, style, {}, menuProps.style);
      props['x-placement'] = placement;
    }

    return _react.default.createElement(Component, (0, _extends2.default)({}, props, menuProps, {
      style: style,
      className: (0, _classnames.default)(className, prefix, show && 'show', alignEnd && prefix + "-right")
    }));
  });
});

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.defaultProps = defaultProps;
var _default = DropdownMenu;
exports.default = _default;
module.exports = exports["default"];