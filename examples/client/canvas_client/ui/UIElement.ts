import { Vector } from "./Vector";

/**
 * Base class for user interface elements.
 * For instance, game pad and buttons.
 * 
 * All elements have relative positions within the view.
 */
export abstract class UIElement {

    /**
     * Local, absolute position within parent.
     */
    private _positionAbsolute: Vector = new Vector();

    /**
     * Local, relative positioning within parent.
     */
    private _positionRelative: Vector = new Vector();


    get positionAbsolute(): Vector {
        return this._positionAbsolute;
    }

    get positionRelative(): Vector {
        return this._positionRelative;
    }

    /**
     * Draw element using given canvas context.
     * 
     * @param ctx Canvas rendering context.
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;
    
    /**
     * Parent size changed. Adjust relative positioning.
     * 
     * @param width 
     * @param height 
     */
    onParentResize(width: number, height: number) {
        // calculate absolute position
        this._positionAbsolute.x = width * this._positionRelative.x;
        this._positionAbsolute.y = height * this._positionRelative.y;
    }

    /**
     * Handles touch or mouse events.
     * 
     * @param x 
     * @param y 
     * @param identifier 
     */
    abstract onPointerDown(x: number, y: number, identifier: number): void;

    /**
     * Handles touch or mouse events.
     * Pointer movement does not imply a previous pointer down event!
     * 
     * @param x 
     * @param y 
     * @param identifier 
     */
    abstract onPointerMove(x: number, y: number, identifier: number): void;

    /**
     * Handles touch or mouse events.
     * 
     * @param identifier 
     */
    abstract onPointerUp(identifier: number): void;
}