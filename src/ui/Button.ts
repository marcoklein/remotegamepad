import { Vector } from "./Vector";
import { UIElement } from "./UIElement";

/**
 * Button for HTML5 canvas.
 */
export class Button extends UIElement {
    position: Vector = new Vector();

    image: HTMLImageElement;

    constructor() {
        super();
        this.image = <HTMLImageElement> document.getElementById('buttonAImage');
    }

    
    onPointerDown(x: number, y: number, identifier: number): void {
        // test if position hits button
        let radius = this.image.width > this.image.height ? this.image.width : this.image.height;
        radius *= radius; // we compare length squared
        if (new Vector(x, y).sub(this.position).lengthSquared() < radius) {
            // clicked
            console.log('button clicked');
        }
    }

    onPointerMove(x: number, y: number, identifier: number): void {
    }
    onPointerUp(identifier: number): void {
    }



    draw(ctx: CanvasRenderingContext2D) {
        let drawPosition = this.position.copy();
        //drawPosition.x = ctx.canvas.width - drawPosition.x;
        //drawPosition.y = ctx.canvas.height - drawPosition.y;
        ctx.drawImage(
            this.image,
            drawPosition.x - this.image.width / 2,
            drawPosition.y - this.image.height / 2
        )
    }

}