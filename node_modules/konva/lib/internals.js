"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Global"));
var Util_1 = require("./Util");
exports.Collection = Util_1.Collection;
exports.Util = Util_1.Util;
var Node_1 = require("./Node");
exports.Node = Node_1.Node;
exports.ids = Node_1.ids;
exports.names = Node_1.names;
var Container_1 = require("./Container");
exports.Container = Container_1.Container;
var Stage_1 = require("./Stage");
exports.Stage = Stage_1.Stage;
exports.stages = Stage_1.stages;
var Layer_1 = require("./Layer");
exports.Layer = Layer_1.Layer;
var FastLayer_1 = require("./FastLayer");
exports.FastLayer = FastLayer_1.FastLayer;
var Group_1 = require("./Group");
exports.Group = Group_1.Group;
var DragAndDrop_1 = require("./DragAndDrop");
exports.DD = DragAndDrop_1.DD;
var Shape_1 = require("./Shape");
exports.Shape = Shape_1.Shape;
exports.shapes = Shape_1.shapes;
var Animation_1 = require("./Animation");
exports.Animation = Animation_1.Animation;
var Tween_1 = require("./Tween");
exports.Tween = Tween_1.Tween;
exports.Easings = Tween_1.Easings;
exports.enableTrace = false;
exports.listenClickTap = false;
exports.inDblClickWindow = false;
exports.pixelRatio = undefined;
exports.dragDistance = 3;
exports.angleDeg = true;
exports.showWarnings = true;
exports.dragButtons = [0, 1];
exports.isDragging = function () {
    return DragAndDrop_1.DD.isDragging;
};
exports.isDragReady = function () {
    return !!DragAndDrop_1.DD.node;
};
var Arc_1 = require("./shapes/Arc");
exports.Arc = Arc_1.Arc;
var Arrow_1 = require("./shapes/Arrow");
exports.Arrow = Arrow_1.Arrow;
var Circle_1 = require("./shapes/Circle");
exports.Circle = Circle_1.Circle;
var Ellipse_1 = require("./shapes/Ellipse");
exports.Ellipse = Ellipse_1.Ellipse;
var Image_1 = require("./shapes/Image");
exports.Image = Image_1.Image;
var Label_1 = require("./shapes/Label");
exports.Label = Label_1.Label;
exports.Tag = Label_1.Tag;
var Line_1 = require("./shapes/Line");
exports.Line = Line_1.Line;
var Path_1 = require("./shapes/Path");
exports.Path = Path_1.Path;
var Rect_1 = require("./shapes/Rect");
exports.Rect = Rect_1.Rect;
var RegularPolygon_1 = require("./shapes/RegularPolygon");
exports.RegularPolygon = RegularPolygon_1.RegularPolygon;
var Ring_1 = require("./shapes/Ring");
exports.Ring = Ring_1.Ring;
var Sprite_1 = require("./shapes/Sprite");
exports.Sprite = Sprite_1.Sprite;
var Star_1 = require("./shapes/Star");
exports.Star = Star_1.Star;
var Text_1 = require("./shapes/Text");
exports.Text = Text_1.Text;
var TextPath_1 = require("./shapes/TextPath");
exports.TextPath = TextPath_1.TextPath;
var Transformer_1 = require("./shapes/Transformer");
exports.Transformer = Transformer_1.Transformer;
var Wedge_1 = require("./shapes/Wedge");
exports.Wedge = Wedge_1.Wedge;
var Blur_1 = require("./filters/Blur");
var Brighten_1 = require("./filters/Brighten");
var Contrast_1 = require("./filters/Contrast");
var Emboss_1 = require("./filters/Emboss");
var Enhance_1 = require("./filters/Enhance");
var Grayscale_1 = require("./filters/Grayscale");
var HSL_1 = require("./filters/HSL");
var HSV_1 = require("./filters/HSV");
var Invert_1 = require("./filters/Invert");
var Kaleidoscope_1 = require("./filters/Kaleidoscope");
var Mask_1 = require("./filters/Mask");
var Noise_1 = require("./filters/Noise");
var Pixelate_1 = require("./filters/Pixelate");
var Posterize_1 = require("./filters/Posterize");
var RGB_1 = require("./filters/RGB");
var RGBA_1 = require("./filters/RGBA");
var Sepia_1 = require("./filters/Sepia");
var Solarize_1 = require("./filters/Solarize");
var Threshold_1 = require("./filters/Threshold");
exports.Filters = {
    Blur: Blur_1.Blur,
    Brighten: Brighten_1.Brighten,
    Contrast: Contrast_1.Contrast,
    Emboss: Emboss_1.Emboss,
    Enhance: Enhance_1.Enhance,
    Grayscale: Grayscale_1.Grayscale,
    HSL: HSL_1.HSL,
    HSV: HSV_1.HSV,
    Invert: Invert_1.Invert,
    Kaleidoscope: Kaleidoscope_1.Kaleidoscope,
    Mask: Mask_1.Mask,
    Noise: Noise_1.Noise,
    Pixelate: Pixelate_1.Pixelate,
    Posterize: Posterize_1.Posterize,
    RGB: RGB_1.RGB,
    RGBA: RGBA_1.RGBA,
    Sepia: Sepia_1.Sepia,
    Solarize: Solarize_1.Solarize,
    Threshold: Threshold_1.Threshold
};
