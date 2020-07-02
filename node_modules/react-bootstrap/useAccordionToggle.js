"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = require("react");

var _SelectableContext = _interopRequireDefault(require("./SelectableContext"));

var _AccordionContext = _interopRequireDefault(require("./AccordionContext"));

var _default = function _default(eventKey, onClick) {
  var contextEventKey = (0, _react.useContext)(_AccordionContext.default);
  var onSelect = (0, _react.useContext)(_SelectableContext.default);
  return function (e) {
    /* 
      Compare the event key in context with the given event key.
      If they are the same, then collapse the component.
    */
    var eventKeyPassed = eventKey === contextEventKey ? null : eventKey;
    onSelect(eventKeyPassed, e);
    if (onClick) onClick(e);
  };
};

exports.default = _default;
module.exports = exports["default"];