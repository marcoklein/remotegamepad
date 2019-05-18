import $ from 'jquery';
import { ConnectionManager } from './ConnectionManager';
import screenfull, {Screenfull} from 'screenfull';
import { Pad } from './Pad';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
let ctx = canvas.getContext('2d');

let connectionManager: ConnectionManager = new ConnectionManager();


let pad = new Pad();
pad.attachListeners(canvas);
/**
 * Draw current state.
 */
function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
    pad.draw(ctx);
    
    window.requestAnimationFrame(renderLoop);
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
    // start draw loop
    window.requestAnimationFrame(renderLoop);
}

/**
 * Resize canvas to fit window and redraw.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

(() => {
    initialize();
})();