"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _ThemeProvider = require("./ThemeProvider");

var _FormContext = _interopRequireDefault(require("./FormContext"));

var _Feedback = _interopRequireDefault(require("./Feedback"));

var _FormCheckInput = _interopRequireDefault(require("./FormCheckInput"));

var _FormCheckLabel = _interopRequireDefault(require("./FormCheckLabel"));

var defaultProps = {
  type: 'checkbox',
  inline: false,
  disabled: false,
  isValid: false,
  isInvalid: false,
  title: ''
};

var FormCheck = _react.default.forwardRef(function (_ref, ref) {
  var id = _ref.id,
      bsPrefix = _ref.bsPrefix,
      inline = _ref.inline,
      disabled = _ref.disabled,
      isValid = _ref.isValid,
      isInvalid = _ref.isInvalid,
      feedback = _ref.feedback,
      className = _ref.className,
      style = _ref.style,
      title = _ref.title,
      type = _ref.type,
      label = _ref.label,
      children = _ref.children,
      custom = _ref.custom,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["id", "bsPrefix", "inline", "disabled", "isValid", "isInvalid", "feedback", "className", "style", "title", "type", "label", "children", "custom"]);
  bsPrefix = (0, _ThemeProvider.useBootstrapPrefix)(bsPrefix, 'form-check');

  var _useContext = (0, _react.useContext)(_FormContext.default),
      controlId = _useContext.controlId;

  var innerFormContext = (0, _react.useMemo)(function () {
    return {
      controlId: id || controlId,
      custom: custom
    };
  }, [controlId, custom, id]);
  var hasLabel = label != null && label !== false && !children;

  var input = _react.default.createElement(_FormCheckInput.default, (0, _extends2.default)({}, props, {
    type: type,
    ref: ref,
    isValid: isValid,
    isInvalid: isInvalid,
    isStatic: !hasLabel,
    disabled: disabled
  }));

  return _react.default.createElement(_FormContext.default.Provider, {
    value: innerFormContext
  }, _react.default.createElement("div", {
    style: style,
    className: (0, _classnames.default)(className, !custom && bsPrefix, custom && "custom-control custom-" + type, inline && (custom ? 'custom-control' : bsPrefix) + "-inline")
  }, children || _react.default.createElement(_react.default.Fragment, null, input, hasLabel && _react.default.createElement(_FormCheckLabel.default, {
    title: title
  }, label), (isValid || isInvalid) && _react.default.createElement(_Feedback.default, {
    type: isValid ? 'valid' : 'invalid'
  }, feedback))));
});

FormCheck.displayName = 'FormCheck';
FormCheck.defaultProps = defaultProps;
FormCheck.Input = _FormCheckInput.default;
FormCheck.Label = _FormCheckLabel.default;
var _default = FormCheck;
exports.default = _default;
module.exports = exports["default"];