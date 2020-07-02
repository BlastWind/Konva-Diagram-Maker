import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React, { useContext } from 'react';
import { useBootstrapPrefix } from './ThemeProvider';
import FormContext from './FormContext';
var defaultProps = {
  type: 'checkbox'
};
var FormCheckLabel = React.forwardRef(function (_ref, ref) {
  var bsPrefix = _ref.bsPrefix,
      className = _ref.className,
      htmlFor = _ref.htmlFor,
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "className", "htmlFor"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-label');

  var _useContext = useContext(FormContext),
      controlId = _useContext.controlId,
      custom = _useContext.custom;

  return React.createElement("label", _extends({}, props, {
    ref: ref,
    htmlFor: htmlFor || controlId,
    className: classNames(className, !custom && bsPrefix, custom && 'custom-control-label')
  }));
});
FormCheckLabel.displayName = 'FormCheckLabel';
FormCheckLabel.defaultProps = defaultProps;
export default FormCheckLabel;