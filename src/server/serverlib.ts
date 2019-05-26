import { HostedConnection } from "./HostedConnection";
import { SmartPadClient } from "../client/SmartPadClient";
import { SmartPadServer } from "./SmartPadServer";
import { RemoteGamepad } from "./RemoteGamepad";


/**
 * Simulated gamepads.
 */
let gamepads = [];
/**
 * Simulated and native gamepads.
 */
let combinedGamepads = [];
/**
 * Connected clients are added to a waiting list.
 * Call processWaitingGamepads() to add them.
 */
let waitingGamepads: RemoteGamepad[] = [];

/**
 * Remap original gamepad function.
 */
let nativeGetGamepads = window.navigator.getGamepads.bind(navigator);
/**
 * Assign own function to getGamepads().
 */
window.navigator.getGamepads = function () {
    let nativeGamepads = nativeGetGamepads();
    // traverse through all available gamepads
    let length = Math.max(nativeGamepads.length, gamepads.length);
    // load combined gamepads
    for (let i = 0; i < length; i++) {
        combinedGamepads[i] = gamepads[i] || nativeGamepads[i] || null;
    }
    // if length of all gamepads is larger then splice rest of gamepads
    if (length < combinedGamepads.length) {
        combinedGamepads.splice(length);
    }
    return combinedGamepads;
}


/**
 * Searches next available gamepad index.
 */
function findNextGamepadIndex() {
    for (let i = 0; i < gamepads.length; i++) {
        if (!gamepads[i]) {
            return i;
        }
    }
    // return next available gamepad index
    return gamepads.length;
}


function processWaitingGamepads() {
    while (waitingGamepads.length > 0) {
        let nextIndex = findNextGamepadIndex();

        // process next gamepad
        let gamepad = waitingGamepads.shift();
        gamepads[nextIndex] = gamepad;
        gamepad.index = nextIndex;
        // fire gamepad connected event
        let event = new CustomEvent('gamepadconnected', {});
        (<any> event).gamepad = gamepad; // add gamepad to event
        window.dispatchEvent(event);
    }
}


// create and start smart pad server
let server = new SmartPadServer();
server.start('result');

server.events.on('client_connected', (client: HostedConnection) => {
    let gamepad = new RemoteGamepad(client);
    waitingGamepads.push(gamepad);
    processWaitingGamepads();
})