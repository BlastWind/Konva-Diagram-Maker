import { BaseLayer } from './BaseLayer';
import { HitCanvas } from './Canvas';
import { GetSet } from './types';
export declare class Layer extends BaseLayer {
    hitCanvas: HitCanvas;
    _setCanvasSize(width: any, height: any): void;
    _validateAdd(child: any): void;
    getIntersection(pos: any, selector: any): any;
    _getIntersection(pos: any): {
        shape: any;
        antialiased?: undefined;
    } | {
        antialiased: boolean;
        shape?: undefined;
    } | {
        shape?: undefined;
        antialiased?: undefined;
    };
    drawScene(can: any, top: any): this;
    drawHit(can: any, top: any): this;
    clear(bounds?: any): this;
    enableHitGraph(): this;
    disableHitGraph(): this;
    toggleHitCanvas(): void;
    setSize({ width, height }: {
        width: any;
        height: any;
    }): this;
    hitGraphEnabled: GetSet<boolean, this>;
}
