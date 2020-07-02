import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import React, { useEffect, useState, useRef, useContext } from 'react';
import qsa from 'dom-helpers/query/querySelectorAll';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import SelectableContext, { makeEventKey } from './SelectableContext';
import NavContext from './NavContext';
import TabContext from './TabContext';

var noop = function noop() {};

var defaultProps = {
  role: 'tablist'
};
var AbstractNav = React.forwardRef(function (_ref, ref) {
  var _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'ul' : _ref$as,
      onSelect = _ref.onSelect,
      activeKey = _ref.activeKey,
      role = _ref.role,
      onKeyDown = _ref.onKeyDown,
      props = _objectWithoutPropertiesLoose(_ref, ["as", "onSelect", "activeKey", "role", "onKeyDown"]);

  var parentOnSelect = useContext(SelectableContext);
  var tabContext = useContext(TabContext);
  var getControlledId, getControllerId;

  if (tabContext) {
    activeKey = tabContext.activeKey;
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }

  var _useState = useState(false),
      needsRefocus = _useState[0],
      setRefocus = _useState[1];

  var listNode = useRef(null);

  var getNextActiveChild = function getNextActiveChild(offset) {
    if (!listNode.current) return null;
    var items = qsa(listNode.current, '[data-rb-event-key]:not(.disabled)');
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

  useEffect(function () {
    if (listNode.current && needsRefocus) {
      var activeChild = listNode.current.querySelector('[data-rb-event-key].active');
      if (activeChild) activeChild.focus();
    }
  }, [listNode, needsRefocus]);
  var mergedRef = useMergedRefs(ref, listNode);
  return React.createElement(SelectableContext.Provider, {
    value: handleSelect
  }, React.createElement(NavContext.Provider, {
    value: {
      role: role,
      // used by NavLink to determine it's role
      activeKey: makeEventKey(activeKey),
      getControlledId: getControlledId || noop,
      getControllerId: getControllerId || noop
    }
  }, React.createElement(Component, _extends({}, props, {
    onKeyDown: handleKeyDown,
    ref: mergedRef
  }))));
});
AbstractNav.defaultProps = defaultProps;
export default AbstractNav;