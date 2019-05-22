
/**
 * Base class for user interface elements.
 * For instance, game pad and buttons.
 */
export abstract class UIElement {
    /**
     * Draw element using given canvas context.
     * 
     * @param ctx Canvas rendering context.
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;

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