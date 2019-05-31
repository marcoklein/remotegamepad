import { HostedConnection } from "../network/server/HostedConnection";
import { SmartPadServer } from "../network/server/SmartPadServer";
import { RemoteGamepad } from "./RemoteGamepad";


/**
 * Maps on native web gamepad API.
 */
export class RemoteGamepadAPI {
    private static _instance: RemoteGamepadAPI;

    /**
     * There can always be only one instance of the API.
     */
    static getInstance(): RemoteGamepadAPI {
        if (!RemoteGamepadAPI._instance) {
            RemoteGamepadAPI._instance = new RemoteGamepadAPI();
        }
        return RemoteGamepadAPI._instance;
    }


    
    /**
     * Simulated gamepads.
     */
    gamepads: Array<Gamepad | RemoteGamepad> = [];
    /**
     * Simulated and native gamepads.
     */
    combinedGamepads: Array<Gamepad | RemoteGamepad> = [];
    /**
     * Connected clients are added to a waiting list.
     * Call processWaitingGamepads() to add them.
     */
    waitingGamepads: RemoteGamepad[] = [];

    /**
     * Remap original gamepad function.
     */
    private readonly nativeGetGamepads: Function;

    private constructor() {
        
        this.nativeGetGamepads = window.navigator.getGamepads.bind(navigator);

        /**
         * Assign own function to getGamepads().
         */
        window.navigator.getGamepads = () => {
            let nativeGamepads = this.nativeGetGamepads();
            // traverse through all available gamepads
            let length = Math.max(nativeGamepads.length, this.gamepads.length);
            // load combined gamepads
            for (let i = 0; i < length; i++) {
                this.combinedGamepads[i] = this.gamepads[i] || nativeGamepads[i] || null;
            }
            // if length of all gamepads is larger then splice rest of gamepads
            if (length < this.combinedGamepads.length) {
                this.combinedGamepads.splice(length);
            }
            return this.combinedGamepads;
        }


        // create and start smart pad server
        let server = new SmartPadServer();
        server.start('catchme2');

        server.events.on('client_connected', (client: HostedConnection) => {
            console.log('client connected');
            let gamepad = new RemoteGamepad(client, this);
            this.waitingGamepads.push(gamepad);
            this.processWaitingGamepads();
        });

        server.events.on('client_disconnected', (client: HostedConnection) => {
        // TODO remove gamepad with client connection 
        });

        console.log('Smartphone gamepad library initialized.');
    }


    
    /**
     * Searches next available gamepad index.
     */
    findNextGamepadIndex() {
        for (let i = 0; i < this.gamepads.length; i++) {
            if (!this.gamepads[i]) {
                return i;
            }
        }
        // return next available gamepad index
        return this.gamepads.length;
    }
    
    processWaitingGamepads() {
        while (this.waitingGamepads.length > 0) {
            let nextIndex = this.findNextGamepadIndex();

            // process next gamepad
            let gamepad = this.waitingGamepads.shift();
            this.gamepads[nextIndex] = gamepad;
            gamepad.index = nextIndex;
            // fire gamepad connected event
            let event = new CustomEvent('gamepadconnected', {});
            (<any> event).gamepad = gamepad; // add gamepad to event
            window.dispatchEvent(event);
            console.log('dispatched gamepadconnected event');
        }
    }

}
