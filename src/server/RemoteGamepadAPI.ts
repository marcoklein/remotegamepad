import { HostedConnection } from "../network/server/HostedConnection";
import { RemoteGamepadServer } from "../network/server/RemoteGamepadServer";
import { RemoteGamepad } from "./RemoteGamepad";


/**
 * The remote gamepad API maps onto the native web gamepad API.
 */
export class RemoteGamepadAPI {
    /**
     * Internally used variable to store an API instance.
     */
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
     * The server manages all connected remote gamepads.
     */
    server: RemoteGamepadServer;
    
    /**
     * Simulated gamepads.
     */
    remoteGamepads: Array<RemoteGamepad> = [];
    /**
     * Simulated and native gamepads.
     */
    private combinedGamepads: Array<Gamepad | RemoteGamepad> = [];
    /**
     * Connected clients are added to a waiting list.
     * Call processWaitingGamepads() to add them.
     */
    private gamepadsToProcess: RemoteGamepad[] = [];

    /**
     * Remap original gamepad function.
     */
    private readonly nativeGetGamepads: Function;

    private constructor() {
        
        // bind to the native getGamepads function
        this.nativeGetGamepads = window.navigator.getGamepads.bind(navigator);

        /**
         * Assign own function to getGamepads().
         */
        window.navigator.getGamepads = () => {
            let nativeGamepads = this.nativeGetGamepads();
            // traverse through all available gamepads
            let length = Math.max(nativeGamepads.length, this.remoteGamepads.length);
            // load combined gamepads
            for (let i = 0; i < length; i++) {
                this.combinedGamepads[i] = this.remoteGamepads[i] || nativeGamepads[i] || null;
            }
            // if length of all gamepads is larger then splice rest of gamepads
            if (length < this.combinedGamepads.length) {
                this.combinedGamepads.splice(length);
            }
            return this.combinedGamepads;
        }


        // create and start smart pad server
        this.server = new RemoteGamepadServer();
        // start server with default connection code
        this.server.start('catchme2').then((connectionCode) => {
            console.log('RemoteGamepad Library Ready!\nConnect Gamepads With Connection Code "' + connectionCode + '"');
        }).catch(reason => {
            console.error('Unable to start the RemoteGamepad Server:', reason);
        });

        // listen to connection events of the remote gamepad server
        this.server.events.on('client_connected', (client: HostedConnection) => {
            console.log('client connected');
            let gamepad = new RemoteGamepad(client, this);
            this.gamepadsToProcess.push(gamepad);
            this.processGamepads();
        });

        this.server.events.on('client_disconnected', (client: HostedConnection) => {
            console.log('client disconnected');
            // TODO remove gamepad with client connection
            // find gamepad
            /*let gamepadIndex = this.remoteGamepads.findIndex((pad) => {
                return pad.remote === client;
            });
            // remove gamepad
            this.remoteGamepads[gamepadIndex] = null;
            this.remoteGamepads*/
        });

    }


    
    /**
     * Searches next available gamepad index.
     */
    findNextGamepadIndex() {
        for (let i = 0; i < this.remoteGamepads.length; i++) {
            if (!this.remoteGamepads[i]) {
                return i;
            }
        }
        // return next available gamepad index
        return this.remoteGamepads.length;
    }
    
    processGamepads() {
        while (this.gamepadsToProcess.length > 0) {
            let nextIndex = this.findNextGamepadIndex();

            // process next gamepad
            let gamepad = this.gamepadsToProcess.shift();
            this.remoteGamepads[nextIndex] = gamepad;
            gamepad.index = nextIndex;
            // fire gamepad connected event
            let event = new CustomEvent('gamepadconnected', {});
            (<any> event).gamepad = gamepad; // add gamepad to event
            window.dispatchEvent(event);
        }
    }

}
