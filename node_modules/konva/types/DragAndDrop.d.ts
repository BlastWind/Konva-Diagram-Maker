import { Animation } from './Animation';
export declare const DD: {
    startPointerPos: {
        x: number;
        y: number;
    };
    anim: Animation;
    isDragging: boolean;
    justDragged: boolean;
    offset: {
        x: number;
        y: number;
    };
    node: any;
    _drag(evt: any): void;
    _endDragBefore(evt: any): void;
    _endDragAfter(evt: any): void;
};
