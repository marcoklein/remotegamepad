import { Vector } from "./Vector";

/**
 * Button for HTML5 canvas.
 */
export class Button {
    position: Vector = new Vector();

    canvas: HTMLCanvasElement;
    image: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.image = <HTMLImageElement> document.getElementById('padDarkImage');
        this.attachListeners();
    }

    private attachListeners() {
        this.canvas.addEventListener('mousedown', (event) => this.mouseDownEvent(event), false);
    }

    private mouseDownEvent(event: MouseEvent) {
        console.log('Button mouse down');
        // test if position hits button
        let radius;
        if (this.image.width > this.image.height) {
            radius = this.image.width * this.image.width;
        } else {
            radius = this.image.height * this.image.height;
        }
        console.log('button radius', radius);
        console.log(new Vector(event.pageX, event.pageY).sub(this.position).length());
        console.log('this images sizes', this.image.sizes);
        radius = 32;
        if (new Vector(event.pageX, event.pageY).sub(this.position).lengthSquared() < radius * radius) {
            // clicked
            console.log('button clicked');
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.image,
            this.position.x - this.image.width / 2,
            this.position.y - this.image.height / 2
        )
    }

}