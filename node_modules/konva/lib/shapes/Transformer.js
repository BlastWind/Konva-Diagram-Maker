"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Factory_1 = require("../Factory");
var Node_1 = require("../Node");
var Shape_1 = require("../Shape");
var Rect_1 = require("./Rect");
var Group_1 = require("../Group");
var Global_1 = require("../Global");
var Validators_1 = require("../Validators");
var Global_2 = require("../Global");
var ATTR_CHANGE_LIST = [
    'resizeEnabledChange',
    'rotateAnchorOffsetChange',
    'rotateEnabledChange',
    'enabledAnchorsChange',
    'anchorSizeChange',
    'borderEnabledChange',
    'borderStrokeChange',
    'borderStrokeWidthChange',
    'borderDashChange',
    'anchorStrokeChange',
    'anchorStrokeWidthChange',
    'anchorFillChange',
    'anchorCornerRadiusChange',
    'ignoreStrokeChange'
].join(' ');
var NODE_RECT = 'nodeRect';
var TRANSFORM_CHANGE_STR = [
    'widthChange.tr',
    'heightChange.tr',
    'scaleXChange.tr',
    'scaleYChange.tr',
    'skewXChange.tr',
    'skewYChange.tr',
    'rotationChange.tr',
    'offsetXChange.tr',
    'offsetYChange.tr',
    'transformsEnabledChange.tr',
    'strokeWidthChange.tr'
].join(' ');
var ANGLES = {
    'top-left': -45,
    'top-center': 0,
    'top-right': 45,
    'middle-right': -90,
    'middle-left': 90,
    'bottom-left': -135,
    'bottom-center': 180,
    'bottom-right': 135
};
function getCursor(anchorName, rad, isMirrored) {
    if (anchorName === 'rotater') {
        return 'crosshair';
    }
    rad += Util_1.Util._degToRad(ANGLES[anchorName] || 0);
    if (isMirrored) {
        rad *= -1;
    }
    var angle = ((Util_1.Util._radToDeg(rad) % 360) + 360) % 360;
    if (Util_1.Util._inRange(angle, 315 + 22.5, 360) || Util_1.Util._inRange(angle, 0, 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 45 - 22.5, 45 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 90 - 22.5, 90 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 135 - 22.5, 135 + 22.5)) {
        return 'nwse-resize';
    }
    else if (Util_1.Util._inRange(angle, 180 - 22.5, 180 + 22.5)) {
        return 'ns-resize';
    }
    else if (Util_1.Util._inRange(angle, 225 - 22.5, 225 + 22.5)) {
        return 'nesw-resize';
    }
    else if (Util_1.Util._inRange(angle, 270 - 22.5, 270 + 22.5)) {
        return 'ew-resize';
    }
    else if (Util_1.Util._inRange(angle, 315 - 22.5, 315 + 22.5)) {
        return 'nwse-resize';
    }
    else {
        Util_1.Util.error('Transformer has unknown angle for cursor detection: ' + angle);
        return 'pointer';
    }
}
var ANCHORS_NAMES = [
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right'
];
var MAX_SAFE_INTEGER = 100000000;
var Transformer = (function (_super) {
    __extends(Transformer, _super);
    function Transformer(config) {
        var _this = _super.call(this, config) || this;
        _this._transforming = false;
        _this._createElements();
        _this._handleMouseMove = _this._handleMouseMove.bind(_this);
        _this._handleMouseUp = _this._handleMouseUp.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.on(ATTR_CHANGE_LIST, _this.update);
        if (_this.getNode()) {
            _this.update();
        }
        return _this;
    }
    Transformer.prototype.attachTo = function (node) {
        this.setNode(node);
        return this;
    };
    Transformer.prototype.setNode = function (node) {
        var _this = this;
        if (this._node) {
            this.detach();
        }
        this._node = node;
        this._resetTransformCache();
        var additionalEvents = node._attrsAffectingSize
            .map(function (prop) { return prop + 'Change.tr'; })
            .join(' ');
        var onChange = function () {
            _this._resetTransformCache();
            if (!_this._transforming) {
                _this.update();
            }
        };
        node.on(additionalEvents, onChange);
        node.on(TRANSFORM_CHANGE_STR, onChange);
        node.on('xChange.tr yChange.tr', function () { return _this._resetTransformCache(); });
        var elementsCreated = !!this.findOne('.top-left');
        if (elementsCreated) {
            this.update();
        }
        return this;
    };
    Transformer.prototype.getNode = function () {
        return this._node;
    };
    Transformer.prototype.detach = function () {
        if (this.getNode()) {
            this.getNode().off('.tr');
            this._node = undefined;
        }
        this._resetTransformCache();
    };
    Transformer.prototype._resetTransformCache = function () {
        this._clearCache(NODE_RECT);
        this._clearCache('transform');
        this._clearSelfAndDescendantCache('absoluteTransform');
    };
    Transformer.prototype._getNodeRect = function () {
        return this._getCache(NODE_RECT, this.__getNodeRect);
    };
    Transformer.prototype.__getNodeRect = function () {
        var node = this.getNode();
        if (!node) {
            return {
                x: -MAX_SAFE_INTEGER,
                y: -MAX_SAFE_INTEGER,
                width: 0,
                height: 0,
                rotation: 0
            };
        }
        if (node.parent && this.parent && node.parent !== this.parent) {
            Util_1.Util.warn('Transformer and attached node have different parents. Konva does not support such case right now. Please move Transformer to the parent of attaching node.');
        }
        var rect = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke()
        });
        var rotation = Global_1.Konva.getAngle(node.rotation());
        var dx = rect.x * node.scaleX() - node.offsetX() * node.scaleX();
        var dy = rect.y * node.scaleY() - node.offsetY() * node.scaleY();
        return {
            x: node.x() + dx * Math.cos(rotation) + dy * Math.sin(-rotation),
            y: node.y() + dy * Math.cos(rotation) + dx * Math.sin(rotation),
            width: rect.width * node.scaleX(),
            height: rect.height * node.scaleY(),
            rotation: node.rotation()
        };
    };
    Transformer.prototype.getX = function () {
        return this._getNodeRect().x;
    };
    Transformer.prototype.getY = function () {
        return this._getNodeRect().y;
    };
    Transformer.prototype.getRotation = function () {
        return this._getNodeRect().rotation;
    };
    Transformer.prototype.getWidth = function () {
        return this._getNodeRect().width;
    };
    Transformer.prototype.getHeight = function () {
        return this._getNodeRect().height;
    };
    Transformer.prototype._createElements = function () {
        this._createBack();
        ANCHORS_NAMES.forEach(function (name) {
            this._createAnchor(name);
        }.bind(this));
        this._createAnchor('rotater');
    };
    Transformer.prototype._createAnchor = function (name) {
        var _this = this;
        var anchor = new Rect_1.Rect({
            stroke: 'rgb(0, 161, 255)',
            fill: 'white',
            strokeWidth: 1,
            name: name + ' _anchor',
            dragDistance: 0,
            draggable: true
        });
        var self = this;
        anchor.on('mousedown touchstart', function (e) {
            self._handleMouseDown(e);
        });
        anchor.on('dragstart', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('dragmove', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('dragend', function (e) {
            e.cancelBubble = true;
        });
        anchor.on('mouseenter', function () {
            var rad = Global_1.Konva.getAngle(_this.rotation());
            var scale = _this.getNode().getAbsoluteScale();
            var isMirrored = scale.y * scale.x < 0;
            var cursor = getCursor(name, rad, isMirrored);
            anchor.getStage().content.style.cursor = cursor;
            _this._cursorChange = true;
        });
        anchor.on('mouseout', function () {
            if (!anchor.getStage() || !anchor.getParent()) {
                return;
            }
            anchor.getStage().content.style.cursor = '';
            _this._cursorChange = false;
        });
        this.add(anchor);
    };
    Transformer.prototype._createBack = function () {
        var back = new Shape_1.Shape({
            name: 'back',
            width: 0,
            height: 0,
            listening: false,
            sceneFunc: function (ctx) {
                var tr = this.getParent();
                var padding = tr.padding();
                ctx.beginPath();
                ctx.rect(-padding, -padding, this.width() + padding * 2, this.height() + padding * 2);
                ctx.moveTo(this.width() / 2, -padding);
                if (tr.rotateEnabled()) {
                    ctx.lineTo(this.width() / 2, -tr.rotateAnchorOffset() * Util_1.Util._sign(this.height()));
                }
                ctx.fillStrokeShape(this);
            }
        });
        this.add(back);
    };
    Transformer.prototype._handleMouseDown = function (e) {
        this.movingResizer = e.target.name().split(' ')[0];
        var attrs = this._getNodeRect();
        var width = attrs.width;
        var height = attrs.height;
        var hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.sin = Math.abs(height / hypotenuse);
        this.cos = Math.abs(width / hypotenuse);
        window.addEventListener('mousemove', this._handleMouseMove);
        window.addEventListener('touchmove', this._handleMouseMove);
        window.addEventListener('mouseup', this._handleMouseUp, true);
        window.addEventListener('touchend', this._handleMouseUp, true);
        this._transforming = true;
        this._fire('transformstart', { evt: e });
        this.getNode()._fire('transformstart', { evt: e });
    };
    Transformer.prototype._handleMouseMove = function (e) {
        var x, y, newHypotenuse;
        var resizerNode = this.findOne('.' + this.movingResizer);
        var stage = resizerNode.getStage();
        var box = stage.getContent().getBoundingClientRect();
        var zeroPoint = {
            x: box.left,
            y: box.top
        };
        var pointerPos = {
            left: e.clientX !== undefined ? e.clientX : e.touches[0].clientX,
            top: e.clientX !== undefined ? e.clientY : e.touches[0].clientY
        };
        var newAbsPos = {
            x: pointerPos.left - zeroPoint.x,
            y: pointerPos.top - zeroPoint.y
        };
        resizerNode.setAbsolutePosition(newAbsPos);
        var keepProportion = this.keepRatio() || e.shiftKey;
        if (this.movingResizer === 'top-left') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x() - resizerNode.x(), 2) +
                    Math.pow(this.findOne('.bottom-right').y() - resizerNode.y(), 2));
                var reverse = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverse;
                y = newHypotenuse * this.sin * reverse;
                this.findOne('.top-left').x(this.findOne('.bottom-right').x() - x);
                this.findOne('.top-left').y(this.findOne('.bottom-right').y() - y);
            }
        }
        else if (this.movingResizer === 'top-center') {
            this.findOne('.top-left').y(resizerNode.y());
        }
        else if (this.movingResizer === 'top-right') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-left').x() - resizerNode.x(), 2) +
                    Math.pow(this.findOne('.bottom-left').y() - resizerNode.y(), 2));
                var reverse = this.findOne('.top-right').x() < this.findOne('.top-left').x()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverse;
                y = newHypotenuse * this.sin * reverse;
                this.findOne('.top-right').x(x);
                this.findOne('.top-right').y(this.findOne('.bottom-left').y() - y);
            }
            var pos = resizerNode.position();
            this.findOne('.top-left').y(pos.y);
            this.findOne('.bottom-right').x(pos.x);
        }
        else if (this.movingResizer === 'middle-left') {
            this.findOne('.top-left').x(resizerNode.x());
        }
        else if (this.movingResizer === 'middle-right') {
            this.findOne('.bottom-right').x(resizerNode.x());
        }
        else if (this.movingResizer === 'bottom-left') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.top-right').x() - resizerNode.x(), 2) +
                    Math.pow(this.findOne('.top-right').y() - resizerNode.y(), 2));
                var reverse = this.findOne('.top-right').x() < this.findOne('.bottom-left').x()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverse;
                y = newHypotenuse * this.sin * reverse;
                this.findOne('.bottom-left').x(this.findOne('.top-right').x() - x);
                this.findOne('.bottom-left').y(y);
            }
            pos = resizerNode.position();
            this.findOne('.top-left').x(pos.x);
            this.findOne('.bottom-right').y(pos.y);
        }
        else if (this.movingResizer === 'bottom-center') {
            this.findOne('.bottom-right').y(resizerNode.y());
        }
        else if (this.movingResizer === 'bottom-right') {
            if (keepProportion) {
                newHypotenuse = Math.sqrt(Math.pow(this.findOne('.bottom-right').x(), 2) +
                    Math.pow(this.findOne('.bottom-right').y(), 2));
                var reverse = this.findOne('.top-left').x() > this.findOne('.bottom-right').x()
                    ? -1
                    : 1;
                x = newHypotenuse * this.cos * reverse;
                y = newHypotenuse * this.sin * reverse;
                this.findOne('.bottom-right').x(x);
                this.findOne('.bottom-right').y(y);
            }
        }
        else if (this.movingResizer === 'rotater') {
            var padding = this.padding();
            var attrs = this._getNodeRect();
            x = resizerNode.x() - attrs.width / 2;
            y = -resizerNode.y() + attrs.height / 2;
            var dAlpha = Math.atan2(-y, x) + Math.PI / 2;
            if (attrs.height < 0) {
                dAlpha -= Math.PI;
            }
            var rot = Global_1.Konva.getAngle(this.rotation());
            var newRotation = Util_1.Util._radToDeg(rot) + Util_1.Util._radToDeg(dAlpha);
            var alpha = Global_1.Konva.getAngle(this.getNode().rotation());
            var newAlpha = Util_1.Util._degToRad(newRotation);
            var snaps = this.rotationSnaps();
            var offset = 0.1;
            for (var i = 0; i < snaps.length; i++) {
                var angle = Global_1.Konva.getAngle(snaps[i]);
                var dif = Math.abs(angle - Util_1.Util._degToRad(newRotation)) % (Math.PI * 2);
                if (dif < offset) {
                    newRotation = Util_1.Util._radToDeg(angle);
                    newAlpha = Util_1.Util._degToRad(newRotation);
                }
            }
            var dx = padding;
            var dy = padding;
            this._fitNodeInto({
                rotation: Global_1.Konva.angleDeg ? newRotation : Util_1.Util._degToRad(newRotation),
                x: attrs.x +
                    (attrs.width / 2 + padding) *
                        (Math.cos(alpha) - Math.cos(newAlpha)) +
                    (attrs.height / 2 + padding) *
                        (Math.sin(-alpha) - Math.sin(-newAlpha)) -
                    (dx * Math.cos(rot) + dy * Math.sin(-rot)),
                y: attrs.y +
                    (attrs.height / 2 + padding) *
                        (Math.cos(alpha) - Math.cos(newAlpha)) +
                    (attrs.width / 2 + padding) *
                        (Math.sin(alpha) - Math.sin(newAlpha)) -
                    (dy * Math.cos(rot) + dx * Math.sin(rot)),
                width: attrs.width + padding * 2,
                height: attrs.height + padding * 2
            }, e);
        }
        else {
            console.error(new Error('Wrong position argument of selection resizer: ' + this.movingResizer));
        }
        if (this.movingResizer === 'rotater') {
            return;
        }
        var absPos = this.findOne('.top-left').getAbsolutePosition(this.getParent());
        var centeredScaling = this.centeredScaling() || e.altKey;
        if (centeredScaling) {
            var topLeft = this.findOne('.top-left');
            var bottomRight = this.findOne('.bottom-right');
            var topOffsetX = topLeft.x();
            var topOffsetY = topLeft.y();
            var bottomOffsetX = this.getWidth() - bottomRight.x();
            var bottomOffsetY = this.getHeight() - bottomRight.y();
            bottomRight.move({
                x: -topOffsetX,
                y: -topOffsetY
            });
            topLeft.move({
                x: bottomOffsetX,
                y: bottomOffsetY
            });
            absPos = topLeft.getAbsolutePosition(this.getParent());
        }
        x = absPos.x;
        y = absPos.y;
        var width = this.findOne('.bottom-right').x() - this.findOne('.top-left').x();
        var height = this.findOne('.bottom-right').y() - this.findOne('.top-left').y();
        this._fitNodeInto({
            x: x + this.offsetX(),
            y: y + this.offsetY(),
            width: width,
            height: height
        }, e);
    };
    Transformer.prototype._handleMouseUp = function (e) {
        this._removeEvents(e);
    };
    Transformer.prototype._removeEvents = function (e) {
        if (this._transforming) {
            this._transforming = false;
            window.removeEventListener('mousemove', this._handleMouseMove);
            window.removeEventListener('touchmove', this._handleMouseMove);
            window.removeEventListener('mouseup', this._handleMouseUp, true);
            window.removeEventListener('touchend', this._handleMouseUp, true);
            this._fire('transformend', { evt: e });
            var node = this.getNode();
            if (node) {
                node.fire('transformend', { evt: e });
            }
        }
    };
    Transformer.prototype._fitNodeInto = function (newAttrs, evt) {
        var boundBoxFunc = this.boundBoxFunc();
        if (boundBoxFunc) {
            var oldAttrs = this._getNodeRect();
            newAttrs = boundBoxFunc.call(this, oldAttrs, newAttrs);
        }
        var node = this.getNode();
        if (newAttrs.rotation !== undefined) {
            this.getNode().rotation(newAttrs.rotation);
        }
        var pure = node.getClientRect({
            skipTransform: true,
            skipShadow: true,
            skipStroke: this.ignoreStroke()
        });
        var padding = this.padding();
        var scaleX = (newAttrs.width - padding * 2) / pure.width;
        var scaleY = (newAttrs.height - padding * 2) / pure.height;
        var rotation = Global_1.Konva.getAngle(node.rotation());
        var dx = pure.x * scaleX - padding - node.offsetX() * scaleX;
        var dy = pure.y * scaleY - padding - node.offsetY() * scaleY;
        this.getNode().setAttrs({
            scaleX: scaleX,
            scaleY: scaleY,
            x: newAttrs.x - (dx * Math.cos(rotation) + dy * Math.sin(-rotation)),
            y: newAttrs.y - (dy * Math.cos(rotation) + dx * Math.sin(rotation))
        });
        this._fire('transform', { evt: evt });
        this.getNode()._fire('transform', { evt: evt });
        this.update();
        this.getLayer().batchDraw();
    };
    Transformer.prototype.forceUpdate = function () {
        this._resetTransformCache();
        this.update();
    };
    Transformer.prototype.update = function () {
        var _this = this;
        var attrs = this._getNodeRect();
        var node = this.getNode();
        var scale = { x: 1, y: 1 };
        if (node && node.getParent()) {
            scale = node.getParent().getAbsoluteScale();
        }
        var invertedScale = {
            x: 1 / scale.x,
            y: 1 / scale.y
        };
        var width = attrs.width;
        var height = attrs.height;
        var enabledAnchors = this.enabledAnchors();
        var resizeEnabled = this.resizeEnabled();
        var padding = this.padding();
        var anchorSize = this.anchorSize();
        this.find('._anchor').each(function (node) {
            return node.setAttrs({
                width: anchorSize,
                height: anchorSize,
                offsetX: anchorSize / 2,
                offsetY: anchorSize / 2,
                stroke: _this.anchorStroke(),
                strokeWidth: _this.anchorStrokeWidth(),
                fill: _this.anchorFill(),
                cornerRadius: _this.anchorCornerRadius()
            });
        });
        this.findOne('.top-left').setAttrs({
            x: -padding,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-left') >= 0
        });
        this.findOne('.top-center').setAttrs({
            x: width / 2,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-center') >= 0
        });
        this.findOne('.top-right').setAttrs({
            x: width + padding,
            y: -padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('top-right') >= 0
        });
        this.findOne('.middle-left').setAttrs({
            x: -padding,
            y: height / 2,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-left') >= 0
        });
        this.findOne('.middle-right').setAttrs({
            x: width + padding,
            y: height / 2,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('middle-right') >= 0
        });
        this.findOne('.bottom-left').setAttrs({
            x: -padding,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-left') >= 0
        });
        this.findOne('.bottom-center').setAttrs({
            x: width / 2,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-center') >= 0
        });
        this.findOne('.bottom-right').setAttrs({
            x: width + padding,
            y: height + padding,
            scale: invertedScale,
            visible: resizeEnabled && enabledAnchors.indexOf('bottom-right') >= 0
        });
        var scaledRotateAnchorOffset = -this.rotateAnchorOffset() * Math.abs(invertedScale.y);
        this.findOne('.rotater').setAttrs({
            x: width / 2,
            y: scaledRotateAnchorOffset * Util_1.Util._sign(height),
            scale: invertedScale,
            visible: this.rotateEnabled()
        });
        this.findOne('.back').setAttrs({
            width: width * scale.x,
            height: height * scale.y,
            scale: invertedScale,
            visible: this.borderEnabled(),
            stroke: this.borderStroke(),
            strokeWidth: this.borderStrokeWidth(),
            dash: this.borderDash()
        });
    };
    Transformer.prototype.isTransforming = function () {
        return this._transforming;
    };
    Transformer.prototype.stopTransform = function () {
        if (this._transforming) {
            this._removeEvents();
            var resizerNode = this.findOne('.' + this.movingResizer);
            if (resizerNode) {
                resizerNode.stopDrag();
            }
        }
    };
    Transformer.prototype.destroy = function () {
        if (this.getStage() && this._cursorChange) {
            this.getStage().content.style.cursor = '';
        }
        Group_1.Group.prototype.destroy.call(this);
        this.detach();
        this._removeEvents();
        return this;
    };
    Transformer.prototype.toObject = function () {
        return Node_1.Node.prototype.toObject.call(this);
    };
    return Transformer;
}(Group_1.Group));
exports.Transformer = Transformer;
function validateAnchors(val) {
    if (!(val instanceof Array)) {
        Util_1.Util.warn('enabledAnchors value should be an array');
    }
    if (val instanceof Array) {
        val.forEach(function (name) {
            if (ANCHORS_NAMES.indexOf(name) === -1) {
                Util_1.Util.warn('Unknown anchor name: ' +
                    name +
                    '. Available names are: ' +
                    ANCHORS_NAMES.join(', '));
            }
        });
    }
    return val || [];
}
Transformer.prototype.className = 'Transformer';
Global_2._registerNode(Transformer);
Factory_1.Factory.addGetterSetter(Transformer, 'enabledAnchors', ANCHORS_NAMES, validateAnchors);
Factory_1.Factory.addGetterSetter(Transformer, 'resizeEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorSize', 10, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'rotateEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'rotationSnaps', []);
Factory_1.Factory.addGetterSetter(Transformer, 'rotateAnchorOffset', 50, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderEnabled', true);
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'anchorFill', 'white');
Factory_1.Factory.addGetterSetter(Transformer, 'anchorCornerRadius', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderStroke', 'rgb(0, 161, 255)');
Factory_1.Factory.addGetterSetter(Transformer, 'borderStrokeWidth', 1, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'borderDash');
Factory_1.Factory.addGetterSetter(Transformer, 'keepRatio', true);
Factory_1.Factory.addGetterSetter(Transformer, 'centeredScaling', false);
Factory_1.Factory.addGetterSetter(Transformer, 'ignoreStroke', false);
Factory_1.Factory.addGetterSetter(Transformer, 'padding', 0, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Transformer, 'node');
Factory_1.Factory.addGetterSetter(Transformer, 'boundBoxFunc');
Factory_1.Factory.backCompat(Transformer, {
    lineEnabled: 'borderEnabled',
    rotateHandlerOffset: 'rotateAnchorOffset',
    enabledHandlers: 'enabledAnchors'
});
Util_1.Collection.mapMethods(Transformer);
