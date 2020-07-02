import { Container, ContainerConfig } from './Container';
import { SceneCanvas, HitCanvas } from './Canvas';
import { GetSet } from './types';
import { Group } from './Group';
import { Shape } from './Shape';
export interface LayerConfig extends ContainerConfig {
    clearBeforeDraw?: boolean;
    hitGraphEnabled?: boolean;
    imageSmoothingEnabled?: boolean;
}
export declare abstract class BaseLayer extends Container<Group | Shape> {
    canvas: SceneCanvas;
    hitCanvas: HitCanvas;
    _waitingForDraw: boolean;
    constructor(config?: LayerConfig);
    createPNGStream(): any;
    getCanvas(): SceneCanvas;
    getHitCanvas(): HitCanvas;
    getContext(): import("./Context").Context;
    clear(bounds?: any): this;
    setZIndex(index: any): this;
    moveToTop(): boolean;
    moveUp(): boolean;
    moveDown(): boolean;
    moveToBottom(): boolean;
    getLayer(): this;
    remove(): this;
    getStage(): any;
    setSize({ width, height }: {
        width: any;
        height: any;
    }): this;
    _toKonvaCanvas(config: any): any;
    _checkVisibility(): void;
    _checkSmooth(): void;
    getWidth(): number;
    setWidth(): void;
    getHeight(): number;
    setHeight(): void;
    getIntersection(pos: any, selector?: any): any;
    batchDraw(): this;
    _applyTransform(shape: any, context: any, top: any): void;
    clearBeforeDraw: GetSet<boolean, this>;
    imageSmoothingEnabled: GetSet<boolean, this>;
}
