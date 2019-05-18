import { Vector } from "./Vector";


/**
 * Adds a pad to the screen.
 */
export class Pad {
    origin: Vector = new Vector(300, 300);
    radius: number = 50;
    moveRadius: number = 200;
    mousePos: Vector;
    /**
     * Needed to evaluate multitouch.
     */
    pointerIndex: number;

    constructor() {
        
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

        ctx.drawImage(padBackgroundImage, this.origin.x - padBackgroundImage.width / 2, this.origin.y - padBackgroundImage.height / 2);
        ctx.drawImage(padImage, this.origin.x - padImage.width / 2, this.origin.y - padImage.height / 2);
    }
}