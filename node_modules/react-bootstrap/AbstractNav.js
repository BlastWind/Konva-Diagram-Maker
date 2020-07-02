"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _querySelectorAll = _interopRequireDefault(require("dom-helpers/query/querySelectorAll"));

var _useMergedRefs = _interopRequireDefault(require("@restart/hooks/useMergedRefs"));

var _SelectableContext = _interopRequireWildcard(require("./SelectableContext"));

var _NavContext = _interopRequireDefault(require("./NavContext"));

var _TabContext = _interopRequireDefault(require("./TabContext"));

var noop = function noop() {};

var defaultProps = {
  role: 'tablist'
};

var AbstractNav = _react.default.forwardRef(function (_ref, ref) {
  var _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'ul' : _ref$as,
      onSelect = _ref.onSelect,
      activeKey = _ref.activeKey,
      role = _ref.role,
      onKeyDown = _ref.onKeyDown,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["as", "onSelect", "activeKey", "role", "onKeyDown"]);
  var parentOnSelect = (0, _react.useContext)(_SelectableContext.default);
  var tabContext = (0, _react.useContext)(_TabContext.default);
  var getControlledId, getControllerId;

  if (tabContext) {
    activeKey = tabContext.activeKey;
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }

  var _useState = (0, _react.useState)(false),
      needsRefocus = _useState[0],
      setRefocus = _useState[1];

  var listNode = (0, _react.useRef)(null);

  var getNextActiveChild = function getNextActiveChild(offset) {
    if (!listNode.current) return null;
    var items = (0, _querySelectorAll.default)(listNode.current, '[data-rb-event-key]:not(.disabled)');
    var activeChild = listNode.current.querySelector('.active');
    var index = items.indexOf(activeChild);
    if (index === -1) return null;
    var nextIndex = index + offset;
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;
    return items[nextIndex];
  };

  var handleSelect = function handleSelect(key, event) {
    if (key == null) return;
    if (onSelect) onSelect(key, event);
    if (parentOnSelect) parentOnSelect(key, event);
  };

  var handleKeyDown = function handleKeyDown(event) {
    if (onKeyDown) onKeyDown(event);
    var nextActiveChild;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        nextActiveChild = getNextActiveChild(-1);
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        nextActiveChild = getNextActiveChild(1);
        break;

      default:
        return;
    }

    if (!nextActiveChild) return;
    event.preventDefault();
    handleSelect(nextActiveChild.dataset.rbEventKey, event);
    setRefocus(true);
  };

  (0, _react.useEffect)(function () {
    if (listNode.current && needsRefocus) {
      var activeChild = listNode.current.querySelector('[data-rb-event-key].active');
      if (activeChild) activeChild.focus();
    }
  }, [listNode, needsRefocus]);
  var mergedRef = (0, _useMergedRefs.default)(ref, listNode);
  return _react.default.createElement(_SelectableContext.default.Provider, {
    value: handleSelect
  }, _react.default.createElement(_NavContext.default.Provider, {
    value: {
      role: role,
      // used by NavLink to determine it's role
      activeKey: (0, _SelectableContext.makeEventKey)(activeKey),
      getControlledId: getControlledId || noop,
      getControllerId: getControllerId || noop
    }
  }, _react.default.createElement(Component, (0, _extends2.default)({}, props, {
    onKeyDown: handleKeyDown,
    ref: mergedRef
  }))));
});

AbstractNav.defaultProps = defaultProps;
var _default = AbstractNav;
exports.default = _default;
module.exports = exports["default"];