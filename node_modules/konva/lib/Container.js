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
var Util_1 = require("./Util");
var Factory_1 = require("./Factory");
var Node_1 = require("./Node");
var DragAndDrop_1 = require("./DragAndDrop");
var Validators_1 = require("./Validators");
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = new Util_1.Collection();
        return _this;
    }
    Container.prototype.getChildren = function (filterFunc) {
        if (!filterFunc) {
            return this.children;
        }
        var results = new Util_1.Collection();
        this.children.each(function (child) {
            if (filterFunc(child)) {
                results.push(child);
            }
        });
        return results;
    };
    Container.prototype.hasChildren = function () {
        return this.getChildren().length > 0;
    };
    Container.prototype.removeChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.remove();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.destroyChildren = function () {
        var child;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.parent = null;
            child.index = 0;
            child.destroy();
        }
        this.children = new Util_1.Collection();
        return this;
    };
    Container.prototype.add = function (child) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        if (child.getParent()) {
            child.moveTo(this);
            return this;
        }
        var children = this.children;
        this._validateAdd(child);
        child.index = children.length;
        child.parent = this;
        children.push(child);
        this._fire('add', {
            child: child
        });
        if (child.isDragging()) {
            DragAndDrop_1.DD.anim.setLayers(child.getLayer());
        }
        return this;
    };
    Container.prototype.destroy = function () {
        if (this.hasChildren()) {
            this.destroyChildren();
        }
        _super.prototype.destroy.call(this);
        return this;
    };
    Container.prototype.find = function (selector) {
        return this._generalFind(selector, false);
    };
    Container.prototype.get = function (selector) {
        Util_1.Util.warn('collection.get() method is deprecated. Please use collection.find() instead.');
        return this.find(selector);
    };
    Container.prototype.findOne = function (selector) {
        var result = this._generalFind(selector, true);
        return result.length > 0 ? result[0] : undefined;
    };
    Container.prototype._generalFind = function (selector, findOne) {
        var retArr = [];
        this._descendants(function (node) {
            var valid = node._isMatch(selector);
            if (valid) {
                retArr.push(node);
            }
            if (valid && findOne) {
                return true;
            }
            return false;
        });
        return Util_1.Collection.toCollection(retArr);
    };
    Container.prototype._descendants = function (fn) {
        var shouldStop = false;
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            shouldStop = fn(child);
            if (shouldStop) {
                return true;
            }
            if (!child.hasChildren()) {
                continue;
            }
            shouldStop = child._descendants(fn);
            if (shouldStop) {
                return true;
            }
        }
        return false;
    };
    Container.prototype.toObject = function () {
        var obj = Node_1.Node.prototype.toObject.call(this);
        obj.children = [];
        var children = this.getChildren();
        var len = children.length;
        for (var n = 0; n < len; n++) {
            var child = children[n];
            obj.children.push(child.toObject());
        }
        return obj;
    };
    Container.prototype._getDescendants = function (arr) {
        var retArr = [];
        var len = arr.length;
        for (var n = 0; n < len; n++) {
            var node = arr[n];
            if (this.isAncestorOf(node)) {
                retArr.push(node);
            }
        }
        return retArr;
    };
    Container.prototype.isAncestorOf = function (node) {
        var parent = node.getParent();
        while (parent) {
            if (parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    };
    Container.prototype.clone = function (obj) {
        var node = Node_1.Node.prototype.clone.call(this, obj);
        this.getChildren().each(function (no) {
            node.add(no.clone());
        });
        return node;
    };
    Container.prototype.getAllIntersections = function (pos) {
        var arr = [];
        this.find('Shape').each(function (shape) {
            if (shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        });
        return arr;
    };
    Container.prototype._setChildrenIndices = function () {
        this.children.each(function (child, n) {
            child.index = n;
        });
    };
    Container.prototype.drawScene = function (can, top, caching) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas()), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedSceneCanvas = cachedCanvas && cachedCanvas.scene;
        if (this.isVisible() || caching) {
            if (!caching && cachedSceneCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedSceneCanvas(context);
                context.restore();
            }
            else {
                this._drawChildren(canvas, 'drawScene', top, false, caching, caching);
            }
        }
        return this;
    };
    Container.prototype.drawHit = function (can, top, caching) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas), context = canvas && canvas.getContext(), cachedCanvas = this._getCanvasCache(), cachedHitCanvas = cachedCanvas && cachedCanvas.hit;
        if (this.shouldDrawHit(canvas) || caching) {
            if (!caching && cachedHitCanvas) {
                context.save();
                layer._applyTransform(this, context, top);
                this._drawCachedHitCanvas(context);
                context.restore();
            }
            else {
                this._drawChildren(canvas, 'drawHit', top, false, caching, caching);
            }
        }
        return this;
    };
    Container.prototype._drawChildren = function (canvas, drawMethod, top, caching, skipBuffer, skipComposition) {
        var layer = this.getLayer(), context = canvas && canvas.getContext(), clipWidth = this.clipWidth(), clipHeight = this.clipHeight(), clipFunc = this.clipFunc(), hasClip = (clipWidth && clipHeight) || clipFunc, clipX, clipY;
        if (hasClip && layer) {
            context.save();
            var transform = this.getAbsoluteTransform(top);
            var m = transform.getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            context.beginPath();
            if (clipFunc) {
                clipFunc.call(this, context, this);
            }
            else {
                clipX = this.clipX();
                clipY = this.clipY();
                context.rect(clipX, clipY, clipWidth, clipHeight);
            }
            context.clip();
            m = transform
                .copy()
                .invert()
                .getMatrix();
            context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        var hasComposition = this.globalCompositeOperation() !== 'source-over' && !skipComposition;
        if (hasComposition && layer) {
            context.save();
            context._applyGlobalCompositeOperation(this);
        }
        this.children.each(function (child) {
            child[drawMethod](canvas, top, caching, skipBuffer);
        });
        if (hasComposition && layer) {
            context.restore();
        }
        if (hasClip && layer) {
            context.restore();
        }
    };
    Container.prototype.shouldDrawHit = function (canvas) {
        var layer = this.getLayer();
        var layerUnderDrag = DragAndDrop_1.DD.isDragging && DragAndDrop_1.DD.anim.getLayers().indexOf(layer) !== -1;
        return ((canvas && canvas.isCache) ||
            (layer && layer.hitGraphEnabled() && this.isVisible() && !layerUnderDrag));
    };
    Container.prototype.getClientRect = function (attrs) {
        attrs = attrs || {};
        var skipTransform = attrs.skipTransform;
        var relativeTo = attrs.relativeTo;
        var minX, minY, maxX, maxY;
        var selfRect = {
            x: Infinity,
            y: Infinity,
            width: 0,
            height: 0
        };
        var that = this;
        this.children.each(function (child) {
            if (!child.visible()) {
                return;
            }
            var rect = child.getClientRect({
                relativeTo: that,
                skipShadow: attrs.skipShadow,
                skipStroke: attrs.skipStroke
            });
            if (rect.width === 0 && rect.height === 0) {
                return;
            }
            if (minX === undefined) {
                minX = rect.x;
                minY = rect.y;
                maxX = rect.x + rect.width;
                maxY = rect.y + rect.height;
            }
            else {
                minX = Math.min(minX, rect.x);
                minY = Math.min(minY, rect.y);
                maxX = Math.max(maxX, rect.x + rect.width);
                maxY = Math.max(maxY, rect.y + rect.height);
            }
        });
        var shapes = this.find('Shape');
        var hasVisible = false;
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape._isVisible(this)) {
                hasVisible = true;
                break;
            }
        }
        if (hasVisible) {
            selfRect = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        else {
            selfRect = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
        if (!skipTransform) {
            return this._transformedRect(selfRect, relativeTo);
        }
        return selfRect;
    };
    return Container;
}(Node_1.Node));
exports.Container = Container;
Factory_1.Factory.addComponentsGetterSetter(Container, 'clip', [
    'x',
    'y',
    'width',
    'height'
]);
Factory_1.Factory.addGetterSetter(Container, 'clipX', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipY', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipWidth', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipHeight', undefined, Validators_1.getNumberValidator());
Factory_1.Factory.addGetterSetter(Container, 'clipFunc');
Util_1.Collection.mapMethods(Container);
