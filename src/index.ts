import $ from 'jquery';
import { ConnectionManager } from './ConnectionManager';
import screenfull, {Screenfull} from 'screenfull';
import { Pad } from './Pad';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


let gamepadCanvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
let ctx = gamepadCanvas.getContext('2d');

let connectionManager: ConnectionManager = new ConnectionManager();


let pad = new Pad();
/**
 * Draw current state.
 */
function draw() {
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
    pad.draw(ctx);
}

/**
 * Use screenfull.js to toggle fullscreen if available.
 */
function requestFullscreen() {
    fullscreenPlugin.toggle();
}

/**
 * Initialize canvas to fit window size and draw.
 */
function initialize() {
    // init fullscreen button
    if (fullscreenPlugin.enabled) {
        $('#fullscreenButton').on('click', requestFullscreen);
    } else {
        // not allowed to enter fullscreen
        $('#fullscreenButton').remove();
    }
    // show button only if fullscreen mode is not active
    fullscreenPlugin.on('change', () => {
        if (fullscreenPlugin.isFullscreen) {
            $('#fullscreenButton').hide();
        } else {
            $('#fullscreenButton').show();
        }
    });

    // later provide id
    //connectionManager.connect('CATCHME2');

    // init resize behavior
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}

/**
 * Resize canvas to fit window and redraw.
 */
function resizeCanvas() {
    gamepadCanvas.width = window.innerWidth;
    gamepadCanvas.height = window.innerHeight;
    draw();
}

(() => {
    initialize();
})();