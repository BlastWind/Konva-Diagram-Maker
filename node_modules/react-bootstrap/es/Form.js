import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import classNames from 'classnames';
import React from 'react';
import createWithBsPrefix from './utils/createWithBsPrefix';
import { useBootstrapPrefix } from './ThemeProvider';
import FormGroup from './FormGroup';
import FormControl from './FormControl';
import FormCheck from './FormCheck';
import FormLabel from './FormLabel';
import FormText from './FormText';
var defaultProps = {
  inline: false
};
var Form = React.forwardRef(function (_ref, ref) {
  var bsPrefix = _ref.bsPrefix,
      inline = _ref.inline,
      className = _ref.className,
      validated = _ref.validated,
      _ref$as = _ref.as,
      Component = _ref$as === void 0 ? 'form' : _ref$as,
      props = _objectWithoutPropertiesLoose(_ref, ["bsPrefix", "inline", "className", "validated", "as"]);

  bsPrefix = useBootstrapPrefix(bsPrefix, 'form');
  return React.createElement(Component, _extends({}, props, {
    ref: ref,
    className: classNames(className, validated && 'was-validated', inline && bsPrefix + "-inline")
  }));
});
Form.displayName = 'Form';
Form.defaultProps = defaultProps;
Form.Row = createWithBsPrefix('form-row');
Form.Group = FormGroup;
Form.Control = FormControl;
Form.Check = FormCheck;
Form.Label = FormLabel;
Form.Text = FormText;
export default Form;