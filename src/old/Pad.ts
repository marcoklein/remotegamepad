import { Vector } from "./Vector";


/**
 * Adds a pad to the screen.
 */
export class Pad {
    padOrigin: Vector = new Vector(300, 300);
    padRadius: number = 50;
    moveRadius: number = 100;
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
        //event.preventDefault();
        this.mousePos.set(
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY,
        );
    }

    private touchMoveEvent(event: TouchEvent) {
        //event.preventDefault();
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

        ctx.drawImage(padBackgroundImage, this.padOrigin.x - padBackgroundImage.width / 2, this.padOrigin.y - padBackgroundImage.height / 2);

        // calculate target position of image
        if (!this.mousePos) {
            // draw at original position if no touch event is provided
            ctx.drawImage(padImage, this.padOrigin.x - padImage.width / 2, this.padOrigin.y - padImage.height / 2);
        } else {
            // move pad in direction of mouse, but max at border of move radius
            // check if mouse is inside move radius
            let targetVec: Vector;
            if (this.mousePos.copy().sub(this.padOrigin).lengthSquared() < (this.moveRadius - this.padRadius) * (this.moveRadius - this.padRadius)) {
                // mouse inside move area
                targetVec = new Vector(this.mousePos.x, this.mousePos.y);
            } else {
                // if not, move max to move radius...
                targetVec = this.mousePos.copy().sub(this.padOrigin).normalize().scale(this.moveRadius - this.padRadius).add(this.padOrigin);
            }
            ctx.drawImage(padImage, targetVec.x - padImage.width / 2, targetVec.y - padImage.height / 2);
        }
    }
}