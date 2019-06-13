import { Vector } from "./Vector";
import { UIElement } from "./UIElement";
import EventEmitter from 'eventemitter3';


/**
 * Button for HTML5 canvas.
 */
export class Button extends UIElement {
    image: HTMLImageElement;

    private _pressed: boolean;
    private pointerIdentifier: number = null;

    /**
     * Listeners.
     */
    readonly events: EventEmitter<'stateChanged'>;

    constructor(image: HTMLImageElement) {
        super();
        this.image = image;
        this.events = new EventEmitter();
    }

    
    onPointerDown(x: number, y: number, identifier: number): void {
        // test if position hits button
        if (this.pointerIdentifier === null && this.pointHitsButton(x, y)) {
            // pressed
            this.pointerIdentifier = identifier;
            this._pressed = true;
            this.events.emit('stateChanged', this._pressed);
        }
    }

    onPointerMove(x: number, y: number, identifier: number): void {
        // if pointer moves outside of button, mark as unpressed
        if (this.pointerIdentifier === identifier) {
            if (this.pointHitsButton(x, y)) {
                if (!this._pressed) {
                    // pressed
                    this._pressed = true;
                    this.events.emit('stateChanged', this._pressed);
                }
            } else if (this._pressed) {
                // unpressed
                this.pointerIdentifier = null;
                this._pressed = false;
                this.events.emit('stateChanged', this._pressed);
            }
        }
    }

    onPointerUp(identifier: number): void {
        if (this.pointerIdentifier === identifier) {
            // unpressed
            this.pointerIdentifier = null;
            this._pressed = false;
            this.events.emit('stateChanged', this._pressed);
        }
    }

    /**
     * Internal helper function to test if x|y are inside of button area.
     * @param x 
     * @param y 
     */
    private pointHitsButton(x: number, y: number): boolean {
        // test if position hits button
        let radius = this.image.width > this.image.height ? this.image.width : this.image.height;
        radius *= radius; // we compare length squared
        return new Vector(x, y).sub(this.positionAbsolute).lengthSquared() < radius;
    }



    draw(ctx: CanvasRenderingContext2D) {
        let drawPosition = this.positionAbsolute.copy();
        //drawPosition.x = ctx.canvas.width - drawPosition.x;
        //drawPosition.y = ctx.canvas.height - drawPosition.y;
        ctx.drawImage(
            this.image,
            drawPosition.x - this.image.width / 2,
            drawPosition.y - this.image.height / 2
        )
    }

    /* Getter and Setter */

    /**
     * Returns true if button is pressed.
     */
    get pressed(): boolean {
        return this._pressed;
    }

}