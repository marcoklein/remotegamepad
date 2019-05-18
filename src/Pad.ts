import { Vector } from "./Vector";


/**
 * Adds a pad to the screen.
 */
export class Pad {
    origin: Vector = new Vector(300, 300);
    radius: number = 50;
    moveRadius: number = 200;
    mousePos: Vector = new Vector();
    mouseActive: boolean = false;
    /**
     * Needed to evaluate multitouch.
     */
    pointerIndex: number;

    constructor() {

    }

    attachListeners(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', (event) => this.mouseDownEvent(event), false);
        canvas.addEventListener('mousemove', (event) => this.mouseMoveEvent(event), false);
        
        canvas.addEventListener('touchstart', (event) => this.touchStartEvent(event), false);
        canvas.addEventListener('touchmove', (event) => this.touchMoveEvent(event), false);
    }

    detachListeners(canvas: HTMLCanvasElement) {
        //canvas.removeEventListener('mousedown', this.mouseDownEvent);
    }

    private mouseDownEvent(event: MouseEvent) {
        console.log('mouse down');
        this.mousePos.set(
            event.pageX,
            event.pageY
        );
        this.mouseActive = true;
    }

    private mouseMoveEvent(event: MouseEvent) {
        console.log('mouse down');
        this.mousePos.set(
            event.pageX,
            event.pageY
        );

    }

    
    private touchStartEvent(event: TouchEvent) {
        event.preventDefault();
        this.mousePos.set(
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY,
        );
    }

    private touchMoveEvent(event: TouchEvent) {
        event.preventDefault();
        this.mousePos.set(
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY,
        );
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

        // calculate target position of image
        if (!this.mousePos) {
            // draw at original position if no touch event is provided
            ctx.drawImage(padImage, this.origin.x - padImage.width / 2, this.origin.y - padImage.height / 2);
        } else {
            // move pad in direction of mouse, but max at border of move radius
            let targetX = this.mousePos.x;
            let targetY = this.mousePos.y;
            ctx.drawImage(padImage, targetX- padImage.width / 2, targetY - padImage.height / 2);
        }
    }
}