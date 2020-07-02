import { BaseLayer } from './BaseLayer';
export declare class FastLayer extends BaseLayer {
    _validateAdd(child: any): void;
    _setCanvasSize(width: any, height: any): void;
    hitGraphEnabled(): boolean;
    drawScene(can?: any): this;
    draw(): this;
}
