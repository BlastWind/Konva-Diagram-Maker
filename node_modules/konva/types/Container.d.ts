import { Collection } from './Util';
import { Node, NodeConfig } from './Node';
import { GetSet, IRect } from './types';
export interface ContainerConfig extends NodeConfig {
    clearBeforeDraw?: boolean;
    clipFunc?: (ctx: CanvasRenderingContext2D) => void;
    clipX?: number;
    clipY?: number;
    clipWidth?: number;
    clipHeight?: number;
}
export declare abstract class Container<ChildType extends Node> extends Node<ContainerConfig> {
    children: Collection<ChildType>;
    getChildren(filterFunc?: (item: Node) => boolean): Collection<Node<NodeConfig>>;
    hasChildren(): boolean;
    removeChildren(): this;
    destroyChildren(): this;
    abstract _validateAdd(node: Node): void;
    add(child: ChildType): this;
    destroy(): this;
    find<ChildNode extends Node = Node>(selector: any): Collection<ChildNode>;
    get(selector: any): Collection<Node<NodeConfig>>;
    findOne<ChildNode extends Node = Node>(selector: any): ChildNode;
    _generalFind<ChildNode extends Node = Node>(selector: any, findOne: any): Collection<ChildNode>;
    private _descendants;
    toObject(): any;
    _getDescendants(arr: any): any[];
    isAncestorOf(node: any): boolean;
    clone(obj?: any): any;
    getAllIntersections(pos: any): any[];
    _setChildrenIndices(): void;
    drawScene(can: any, top: any, caching: any): this;
    drawHit(can: any, top: any, caching: any): this;
    _drawChildren(canvas: any, drawMethod: any, top: any, caching?: any, skipBuffer?: any, skipComposition?: any): void;
    shouldDrawHit(canvas?: any): any;
    getClientRect(attrs: any): IRect;
    clip: GetSet<IRect, this>;
    clipX: GetSet<number, this>;
    clipY: GetSet<number, this>;
    clipWidth: GetSet<number, this>;
    clipHeight: GetSet<number, this>;
    clipFunc: GetSet<(ctx: CanvasRenderingContext2D, shape: this) => void, this>;
}
