import { Vector } from "./Vector";


/**
 * Adds a pad to the screen.
 */
export class Pad {
    origin: Vector;
    radius: number = 50;
    moveRadius: number = 200;
    mousePos: Vector;
    /**
     * Needed to evaluate multitouch.
     */
    pointerIndex: number;

    
}