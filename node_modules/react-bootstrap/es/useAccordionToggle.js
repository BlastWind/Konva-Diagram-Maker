import { useContext } from 'react';
import SelectableContext from './SelectableContext';
import AccordionContext from './AccordionContext';
export default (function (eventKey, onClick) {
  var contextEventKey = useContext(AccordionContext);
  var onSelect = useContext(SelectableContext);
  return function (e) {
    /* 
      Compare the event key in context with the given event key.
      If they are the same, then collapse the component.
    */
    var eventKeyPassed = eventKey === contextEventKey ? null : eventKey;
    onSelect(eventKeyPassed, e);
    if (onClick) onClick(e);
  };
});