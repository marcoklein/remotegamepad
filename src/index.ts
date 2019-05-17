import $ from 'jquery';
import screenfull, {Screenfull} from 'screenfull';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


let gamepadCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('gamepadCanvas');
let ctx = gamepadCanvas.getContext('2d');

/**
 * Draw current state.
 */
function draw() {
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
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