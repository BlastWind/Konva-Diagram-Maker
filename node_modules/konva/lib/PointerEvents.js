"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Captures = new Map();
function getCapturedShape(pointerId) {
    return Captures.get(pointerId);
}
exports.getCapturedShape = getCapturedShape;
function createEvent(evt) {
    return {
        evt: evt,
        pointerId: evt.pointerId
    };
}
exports.createEvent = createEvent;
function hasPointerCapture(pointerId, shape) {
    return Captures.get(pointerId) === shape;
}
exports.hasPointerCapture = hasPointerCapture;
function setPointerCapture(pointerId, shape) {
    releaseCapture(pointerId);
    var stage = shape.getStage();
    if (!stage)
        return;
    Captures.set(pointerId, shape);
    shape._fire('gotpointercapture', createEvent(new PointerEvent('gotpointercapture')));
}
exports.setPointerCapture = setPointerCapture;
function releaseCapture(pointerId, target) {
    var shape = Captures.get(pointerId);
    if (!shape)
        return;
    var stage = shape.getStage();
    if (stage && stage.content) {
        stage.content.releasePointerCapture(pointerId);
    }
    Captures.delete(pointerId);
    shape._fire('lostpointercapture', createEvent(new PointerEvent('lostpointercapture')));
}
exports.releaseCapture = releaseCapture;
