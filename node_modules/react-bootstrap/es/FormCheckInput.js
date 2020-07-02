import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useBootstrapPrefix } from './ThemeProvider';
import FormContext from './FormContext';
var defaultProps = {
  type: 'checkbox'
};
var FormCheckInput = React.forwardRef(function (_ref, ref) {
  var id = _ref.id,
      bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      isValid = _ref.isValid,
      isInvalid = _ref.isInvalid,
      isStatic = _ref.isStatic,
      props = _objectWithoutPropertiesLoose(_ref, ["id", "bsPrefix", "className", "isValid", "isInvalid", "isStatic"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-input');

  var _useContext = useContext(FormContext),
      controlId = _useContext.controlId,
      custom = _useContext.custom;

  return React.createElement("input", _extends({}, props, {
    ref: ref,
    id: id || controlId,
    className: classNames(className, !custom && bsPrefix, custom && 'custom-control-input', isValid && 'is-valid', isInvalid && 'is-invalid', isStatic && 'position-static')
  }));
});
FormCheckInput.displayName = 'FormCheckInput';
FormCheckInput.defaultProps = defaultProps;
export default FormCheckInput;