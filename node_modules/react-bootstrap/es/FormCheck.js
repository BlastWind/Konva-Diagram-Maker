import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { useBootstrapPrefix } from './ThemeProvider';
import FormContext from './FormContext';
import Feedback from './Feedback';
import FormCheckInput from './FormCheckInput';
import FormCheckLabel from './FormCheckLabel';
var defaultProps = {
  type: 'checkbox',
  inline: false,
  disabled: false,
  isValid: false,
  isInvalid: false,
  title: ''
};
var FormCheck = React.forwardRef(function (_ref, ref) {
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
      props = _objectWithoutPropertiesLoose(_ref, ["id", "bsPrefix", "inline", "disabled", "isValid", "isInvalid", "feedback", "className", "style", "title", "type", "label", "children", "custom"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check');

  var _useContext = useContext(FormContext),
      controlId = _useContext.controlId;

  var innerFormContext = useMemo(function () {
    return {
      controlId: id || controlId,
      custom: custom
    };
  }, [controlId, custom, id]);
  var hasLabel = label != null && label !== false && !children;
  var input = React.createElement(FormCheckInput, _extends({}, props, {
    type: type,
    ref: ref,
    isValid: isValid,
    isInvalid: isInvalid,
    isStatic: !hasLabel,
    disabled: disabled
  }));
  return React.createElement(FormContext.Provider, {
    value: innerFormContext
  }, React.createElement("div", {
    style: style,
    className: classNames(className, !custom && bsPrefix, custom && "custom-control custom-" + type, inline && (custom ? 'custom-control' : bsPrefix) + "-inline")
  }, children || React.createElement(React.Fragment, null, input, hasLabel && React.createElement(FormCheckLabel, {
    title: title
  }, label), (isValid || isInvalid) && React.createElement(Feedback, {
    type: isValid ? 'valid' : 'invalid'
  }, feedback))));
});
FormCheck.displayName = 'FormCheck';
FormCheck.defaultProps = defaultProps;
FormCheck.Input = FormCheckInput;
FormCheck.Label = FormCheckLabel;
export default FormCheck;