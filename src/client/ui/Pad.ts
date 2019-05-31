import { Vector } from "./Vector";
import { UIElement } from "./UIElement";
import EventEmitter from 'eventemitter3';


/**
 * Adds a pad to the screen.
 */
export class Pad extends UIElement {
    padRadius: number = 50;
    moveRadius: number = 100;
    mousePos: Vector = new Vector();
    mouseActive: boolean = false;
    /**
     * Needed to evaluate multitouch.
     */
    pointerIdentifier: number;

    private _axis: Vector = new Vector();

    readonly events: EventEmitter<'axisUpdate'> = new EventEmitter();


    onPointerDown(x: number, y: number, identifier: number): void {
        // first touch has to be inside movement radius
        if (new Vector(x, y).sub(this.positionAbsolute).lengthSquared() < this.moveRadius * this.moveRadius) {
            this.mousePos.set(x, y);
            this.mouseActive = true;
            this.pointerIdentifier = identifier;
            this.refreshAxis();
        }
    }
    onPointerMove(x: number, y: number, identifier: number): void {
        if (this.pointerIdentifier === identifier) {
            // only update position for same pointer
            this.mousePos.set(x, y);
            this.refreshAxis();
        }
    }
    onPointerUp(identifier: number): void {
        // stop pad movement
        if (this.pointerIdentifier === identifier) {
            this.pointerIdentifier = null;
            this.mouseActive = false;
            this.refreshAxis();
        }
    }

    /**
     * Recalculates axis.
     */
    private refreshAxis() {
        if (this.mouseActive) {
            // recalculate
            this.mousePos.copy(this._axis).sub(this.positionAbsolute).normalize();
        } else {
            // set to zero otherwise
            this._axis.set(0);
        }
        this.events.emit('axisUpdate', this.axis);
    }

    /**
     * Draws on given canvas rendering context.
     * 
     * @param ctx Canvas context to draw on.
     */
    draw(ctx: CanvasRenderingContext2D) {
        // load images
        let padImage = <HTMLImageElement> document.getElementById('padDarkImage');
        let padBackgroundImage = <HTMLImageElement> document.getElementById('padBackgroundDarkImage');

        let drawPosition = this.positionAbsolute.copy();
        //drawPosition.y = ctx.canvas.height - drawPosition.y;

        ctx.drawImage(
            padBackgroundImage,
            drawPosition.x - padBackgroundImage.width / 2,
            drawPosition.y - padBackgroundImage.height / 2);

        // calculate target position of image
        if (!this.mouseActive) {
            // draw at original position if no touch event is provided
            ctx.drawImage(
                padImage,
                drawPosition.x - padImage.width / 2,
                drawPosition.y - padImage.height / 2);
        } else {
            // move pad in direction of mouse, but max at border of move radius
            // check if mouse is inside move radius
            let targetVec: Vector;
            if (this.mousePos.copy().sub(drawPosition).lengthSquared() < (this.moveRadius - this.padRadius) * (this.moveRadius - this.padRadius)) {
                // mouse inside move area
                targetVec = new Vector(this.mousePos.x, this.mousePos.y);
            } else {
                // if not, move max to move radius...
                targetVec = this.mousePos.copy().sub(drawPosition).normalize().scale(this.moveRadius - this.padRadius).add(drawPosition);
            }
            ctx.drawImage(
                padImage,
                targetVec.x - padImage.width / 2,
                targetVec.y - padImage.height / 2);
        }
    }

    get axis(): {x: number, y: number} {
        return {
            x: this._axis.x,
            y: this._axis.y
        }
    }
}