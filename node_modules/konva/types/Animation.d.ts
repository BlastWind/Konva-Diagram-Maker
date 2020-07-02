import { Layer } from './Layer';
export declare class Animation {
    func: () => boolean;
    id: number;
    layers: Layer[];
    frame: {
        time: number;
        timeDiff: number;
        lastTime: any;
        frameRate: number;
    };
    constructor(func: any, layers?: any);
    setLayers(layers: any): this;
    getLayers(): Layer[];
    addLayer(layer: any): boolean;
    isRunning(): boolean;
    start(): this;
    stop(): this;
    _updateFrameObject(time: any): void;
    static animations: any[];
    static animIdCounter: number;
    static animRunning: boolean;
    static _addAnimation(anim: any): void;
    static _removeAnimation(anim: any): void;
    static _runFrames(): void;
    static _animationLoop(): void;
    static _handleAnimation(): void;
}
