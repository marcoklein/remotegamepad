import { UIElement } from "./ui/UIElement";
import { Pad } from "./ui/Pad";
import { Button } from "./ui/Button";
import { RemoteGamepadClient } from '../network/client/RemoteGamepadClient';

/**
 * Main logic for the client.
 * Manages the gamepad user interface, including ui elements like buttons and pads.
 */
export class Application {
    canvas: HTMLCanvasElement;
    /**
     * Canvas rendering context for drawing.
     */
    ctx: CanvasRenderingContext2D;

    /**
     * All contained user interface elements.
     */
    uiElements: UIElement[];

    network: RemoteGamepadClient;

    /**
     * Initiates a new application with given HTML5 canvas for rendering.
     * 
     * @param canvas Canvas for rendering.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    private init() {
        // add listeners
        this.attachEventListeners(this.canvas);

        // init user interface
        this.initUserInterface();

        // start render loop
        window.addEventListener('resize', () => this.resizeCanvas(), false);
        this.resizeCanvas();
        window.requestAnimationFrame(() => this.renderLoop());

        this.network = new RemoteGamepadClient();
    }

    /**
     * Add all necessary elements of the user interface.
     */
    private initUserInterface() {
        // add pad
        /*let pad = new Pad();
        pad.positionRelative.set(0.2, 0.7);
        this.addUiElement(pad);
        let lastAxisUpdate = 0;
        pad.events.on('axisUpdate', (axis: {x: number, y: number}) => {
            // only send axis update every 30 ms
            if ((axis.x === 0 && axis.y === 0) || Date.now() - lastAxisUpdate > 30) {
                lastAxisUpdate = Date.now();
                this.network.sendMessage('axisUpdate', {
                    index: 0,
                    axis: axis
                });
            }
        });*/
        // add left button
        let buttonLeft = new Button(<HTMLImageElement> document.getElementById('buttonLeftImage'));
        buttonLeft.positionRelative.set(0.1, 0.67);
        this.addUiElement(buttonLeft);
        buttonLeft.events.on('stateChanged', (pressed: boolean) => {
            this.network.sendMessage('buttonUpdate', {
                index: 14,
                pressed: pressed
            });
        });
        // add right button
        let buttonRight = new Button(<HTMLImageElement> document.getElementById('buttonRightImage'));
        buttonRight.positionRelative.set(0.3, 0.67);
        this.addUiElement(buttonRight);
        buttonRight.events.on('stateChanged', (pressed: boolean) => {
            this.network.sendMessage('buttonUpdate', {
                index: 15,
                pressed: pressed
            });
        });

        // add button start
        let buttonStart = new Button(<HTMLImageElement> document.getElementById('buttonStartImage'));
        buttonStart.positionRelative.set(0.5, 0.1);
        this.addUiElement(buttonStart);
        buttonStart.events.on('stateChanged', (pressed: boolean) => {
            this.network.sendMessage('buttonUpdate', {
                index: 9,
                pressed: pressed
            });
        });

        // add button A
        let buttonA = new Button(<HTMLImageElement> document.getElementById('buttonAImage'));
        buttonA.positionRelative.set(0.85, 0.6);
        this.addUiElement(buttonA);
        buttonA.events.on('stateChanged', (pressed: boolean) => {
            this.network.sendMessage('buttonUpdate', {
                index: 0,
                pressed: pressed
            });
        });
        // add button B
        let buttonB = new Button(<HTMLImageElement> document.getElementById('buttonBImage'));
        buttonB.positionRelative.set(0.7, 0.7);
        this.addUiElement(buttonB);
        buttonB.events.on('stateChanged', (pressed: boolean) => {
            this.network.sendMessage('buttonUpdate', {
                index: 1,
                pressed: pressed
            });
        });
    }

    private attachEventListeners(canvas: HTMLCanvasElement) {
        // add mouse events
        canvas.addEventListener('mousedown', (event) => {
            event.preventDefault();
            this.handlePointerDown(event.pageX, event.pageY, 0);
        }, false);
        canvas.addEventListener('mousemove', (event) => {
            event.preventDefault();
            this.handlePointerMove(event.pageX, event.pageY, 0);
        }, false);
        canvas.addEventListener('mouseup', (event) => {
            event.preventDefault();
            this.handlePointerUp(0);
        }, false);
        // add touch events
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            for (let i = 0; i < event.targetTouches.length; i++) {
                let touch = event.targetTouches[i];
                this.handlePointerDown(touch.pageX, touch.pageY, touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            for (let i = 0; i < event.targetTouches.length; i++) {
                let touch = event.targetTouches[i];
                this.handlePointerMove(touch.pageX, touch.pageY, touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                this.handlePointerUp(touch.identifier);
            }
        }, false);
        canvas.addEventListener('touchcancel', (event) => {
            event.preventDefault();
            for (let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                this.handlePointerUp(touch.identifier);
            }
        }, false);
    }

    /**
     * Consolidates mouse and touch events.
     * 
     * @param x X-position on page.
     * @param y Y-position on page.
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerDown(x: number, y: number, identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerDown) {
                    element.onPointerDown(x, y, identifier);
                }
            });
        }
    }

    /**
     * Consolidates mouse and touch events.
     * 
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerUp(identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerUp) {
                    element.onPointerUp(identifier);
                }
            });
        }
    }
    
    /**
     * Consolidates mouse and touch events.
     * 
     * @param x X-position on page.
     * @param y Y-position on page.
     * @param identifier Pointer number - for multi touch each pointer has a unique id.
     */
    private handlePointerMove(x: number, y: number, identifier: number) {
        // notify ui elements
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onPointerMove) {
                    element.onPointerMove(x, y, identifier);
                }
            });
        }
    }

    /**
     * Adds given ui element to app.
     * 
     * @param element 
     */
    addUiElement(element: UIElement) {
        if (!this.uiElements) {
            this.uiElements = [];
        }
        element.onParentResize(this.canvas.width, this.canvas.height);
        this.uiElements.push(element);
    }

    /**
     * Core rendering loop.
     * Clears canvas and redraws by requesting window animation frames.
     */
    private renderLoop() {
        // clear background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // user interface
        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                element.draw(this.ctx);
            });
        }

        // request next render frame
        window.requestAnimationFrame(() => this.renderLoop());
    }

    /**
     * Scale canvas to always match window size.
     */
    private resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        if (this.uiElements) {
            this.uiElements.forEach((element) => {
                if (element.onParentResize) {
                    element.onParentResize(this.canvas.width, this.canvas.height);
                }
            });
        }
    }
}