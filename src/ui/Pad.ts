import { Vector } from "./Vector";
import { UIElement } from "./UIElement";


/**
 * Adds a pad to the screen.
 */
export class Pad extends UIElement {
    position: Vector = new Vector(300, 300);
    padRadius: number = 50;
    moveRadius: number = 100;
    mousePos: Vector = new Vector();
    mouseActive: boolean = false;
    /**
     * Needed to evaluate multitouch.
     */
    pointerIdentifier: number;


    onPointerDown(x: number, y: number, identifier: number): void {
        this.mousePos.set(x, y);
        // first touch has to be inside movement radius
        if (new Vector(x, y).sub(this.position).lengthSquared() < this.moveRadius * this.moveRadius) {
            this.mouseActive = true;
            this.pointerIdentifier = identifier;
        }
    }
    onPointerMove(x: number, y: number, identifier: number): void {
        if (this.pointerIdentifier === identifier) {
            // only update position for same pointer
            this.mousePos.set(x, y);
        }
    }
    onPointerUp(identifier: number): void {
        this.mouseActive = false;
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

        ctx.drawImage(padBackgroundImage, this.position.x - padBackgroundImage.width / 2, this.position.y - padBackgroundImage.height / 2);

        // calculate target position of image
        if (!this.mouseActive) {
            // draw at original position if no touch event is provided
            ctx.drawImage(padImage, this.position.x - padImage.width / 2, this.position.y - padImage.height / 2);
        } else {
            // move pad in direction of mouse, but max at border of move radius
            // check if mouse is inside move radius
            let targetVec: Vector;
            if (this.mousePos.copy().sub(this.position).lengthSquared() < (this.moveRadius - this.padRadius) * (this.moveRadius - this.padRadius)) {
                // mouse inside move area
                targetVec = new Vector(this.mousePos.x, this.mousePos.y);
            } else {
                // if not, move max to move radius...
                targetVec = this.mousePos.copy().sub(this.position).normalize().scale(this.moveRadius - this.padRadius).add(this.position);
            }
            ctx.drawImage(padImage, targetVec.x - padImage.width / 2, targetVec.y - padImage.height / 2);
        }
    }
}