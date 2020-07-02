"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = require("./Animation");
var Global_1 = require("./Global");
exports.DD = {
    startPointerPos: {
        x: 0,
        y: 0
    },
    anim: new Animation_1.Animation(function () {
        var b = this.dirty;
        this.dirty = false;
        return b;
    }),
    isDragging: false,
    justDragged: false,
    offset: {
        x: 0,
        y: 0
    },
    node: null,
    _drag: function (evt) {
        var node = exports.DD.node;
        if (node) {
            if (!exports.DD.isDragging) {
                var pos = node.getStage().getPointerPosition();
                if (!pos) {
                    node.getStage().setPointersPositions(evt);
                    pos = node.getStage().getPointerPosition();
                }
                var dragDistance = node.dragDistance();
                var distance = Math.max(Math.abs(pos.x - exports.DD.startPointerPos.x), Math.abs(pos.y - exports.DD.startPointerPos.y));
                if (distance < dragDistance) {
                    return;
                }
            }
            node.getStage().setPointersPositions(evt);
            if (!exports.DD.isDragging) {
                exports.DD.isDragging = true;
                node.fire('dragstart', {
                    type: 'dragstart',
                    target: node,
                    evt: evt
                }, true);
                if (!node.isDragging()) {
                    return;
                }
            }
            node._setDragPosition(evt);
            node.fire('dragmove', {
                type: 'dragmove',
                target: node,
                evt: evt
            }, true);
        }
    },
    _endDragBefore: function (evt) {
        var node = exports.DD.node;
        if (node) {
            exports.DD.anim.stop();
            if (exports.DD.isDragging) {
                exports.DD.isDragging = false;
                exports.DD.justDragged = true;
                Global_1.Konva.listenClickTap = false;
                if (evt) {
                    evt.dragEndNode = node;
                }
            }
            exports.DD.node = null;
            var drawNode = node.getLayer() || (node instanceof Global_1.Konva['Stage'] && node);
            if (drawNode) {
                drawNode.draw();
            }
        }
    },
    _endDragAfter: function (evt) {
        evt = evt || {};
        var dragEndNode = evt.dragEndNode;
        if (evt && dragEndNode) {
            dragEndNode.fire('dragend', {
                type: 'dragend',
                target: dragEndNode,
                evt: evt
            }, true);
        }
    }
};
if (Global_1.Konva.isBrowser) {
    window.addEventListener('mouseup', exports.DD._endDragBefore, true);
    window.addEventListener('touchend', exports.DD._endDragBefore, true);
    window.addEventListener('mousemove', exports.DD._drag);
    window.addEventListener('touchmove', exports.DD._drag);
    window.addEventListener('mouseup', exports.DD._endDragAfter, false);
    window.addEventListener('touchend', exports.DD._endDragAfter, false);
}
