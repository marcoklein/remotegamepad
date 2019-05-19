import $ from 'jquery';
import screenfull, { Screenfull } from 'screenfull';
import { ConnectionManager, ConnectionListener } from './ConnectionManager';
import { Pad } from './Pad';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
let ctx = canvas.getContext('2d');

let connectionManager: ConnectionManager = new ConnectionManager();
connectionManager.addListener(<ConnectionListener> {
    connectionEstablished(): void {

    },
    connectionLost(): void {

    },
    connectionMessageUpdate(msg: string): void {
        console.log('changed msg: ' + msg);
        $('#connectionMessage').text(msg);
    }
});


let pad = new Pad();
pad.attachListeners(canvas);
/**
 * Draw current state.
 */
function renderLoop() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw last ping
    ctx.font = '30px Arial';
    ctx.fillText('Ping: ' + connectionManager.lastPing, canvas.width * 0.5, canvas.height * 0.05)
    // draw game pad
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

    /*$('#connectButton').on('click', () => {
        let connectionCode = <string> $('#connectionCodeInput').val();
        console.log('Attempting connection with code ' + connectionCode);
        connectionManager.connect(connectionCode);
    });*/
    connectionManager.connect('CATCHME2');


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