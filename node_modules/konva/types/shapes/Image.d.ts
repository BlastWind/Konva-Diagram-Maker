import { Shape, ShapeConfig } from '../Shape';
import { GetSet, IRect } from '../types';
export interface ImageConfig extends ShapeConfig {
    image: ImageBitmapSource;
    crop?: IRect;
}
export declare class Image extends Shape<ImageConfig> {
    _useBufferCanvas(): boolean;
    _sceneFunc(context: any): void;
    _hitFunc(context: any): void;
    getWidth(): any;
    getHeight(): any;
    static fromURL(url: any, callback: any): void;
    image: GetSet<CanvasImageSource, this>;
    crop: GetSet<IRect, this>;
    cropX: GetSet<number, this>;
    cropY: GetSet<number, this>;
    cropWidth: GetSet<number, this>;
    cropHeight: GetSet<number, this>;
}
