
import Peer, { DataConnection } from 'peerjs';
import { PRE_ID as PRE_CONNECTION_CODE, CONNECTION_PROPS } from '../../globals';
import { HostedConnection } from './HostedConnection';
import EventEmitter from 'eventemitter3';

/**
 * Buttons follow official W3C HTML Gamepad Specifications from
 * https://www.w3.org/TR/gamepad/#remapping
 */
export class RemoteGamepadServer {

    /**
     * Server side WebRTC peer.
     */
    peer: Peer;

    /**
     * Connection code for client this server has.
     * Is set during start().
     */
    private _connectionCode: string;

    /**
     * Characters that the code generation algorithm uses to build a random connection code.
     * Per default, this is the character set of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.
     */
    codeCharacters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    /**
     * Length of a randomly generated connection code.
     * 5 per default.
     */
    connectionCodeLength: number = 5;

    /**
     * Flag, that is set to true when start() has been called and the Promise not yet been resolved.
     */
    startingServer: boolean;

    /**
     * The promise of the starting server.
     */
    startPromise: Promise<string>;

    /**
     * All connected clients.
     */
    clients: HostedConnection[];

    /**
     * Listen to client connection events.
     */
    events: EventEmitter<'client_connected' | 'client_disconnected'> = new EventEmitter();
    
    /**
     * Creates a new server.
     */
    constructor() {
    }


    /**
     * Starts the server with the given connection code.
     * If none is given, a random connection code is generated.
     * 
     * Due to the nature of WebRTC the desired code might be occupied.
     * Therefore, the server tries to reconnect (10 times per default), generating a unique code each time.
     * 
     * If no connection could be established the returned Promise is rejected.
     * 
     * @param connectionCode Desired connection code.
     * @param numberOfRetries Connection retries before failure.
     * @return Promise that resolves with the connection code.
     */
    start(connectionCode?: string, numberOfRetries: number = 10): Promise<string> {
        if (this.startingServer || this.peer) {
            throw new Error('Server can not start twice. Call stop() if started.');
        }
        // reset clients
        this.clients = [];
        // prohibit second server starting to prevent errors
        this.startingServer = true;
        this.startPromise = new Promise((resolve, reject) => {
            let numberOfTries = 0;
            let establishConnection = () => {
                let code = connectionCode || this.generateRandomConnectionCode();
                this.openPeerWithId(code, (error) => {
                    if (!error) {
                        // release starting lock
                        this.startingServer = false;
                        this._connectionCode = code;
                        this.initNewServerPeer();
                        resolve(code);
                    } else {
                        numberOfTries++;
                        if (numberOfTries >= numberOfRetries) {
                            // return with an error
                            this.startingServer = false;
                            this.peer.destroy();
                            this.peer = null;
                            reject(error);
                            return;
                        }
                        // try again
                        establishConnection();
                    }
                });
            };

            establishConnection();
        });
        return this.startPromise;
    }

    /**
     * After successfull registration of a server peer event listeners need to be registered.
     */
    private initNewServerPeer() {
        this.peer.on('connection', this.onPeerConnection);
    }

    /**
     * 
     * @param connectionCode 
     * @param callback 
     */
    private openPeerWithId(connectionCode: string, callback: (error?: any) => void) {
        let deregisterCallbacks = () => {
            this.peer.off('open', openCallback);
            this.peer.off('error', errorCallback);
        }
        // callback if peer with id could be created
        let openCallback = (id: string) => {
            deregisterCallbacks();
            callback();
        };
        // callback if peer with id could not be created
        let errorCallback = (err: any) => {
            deregisterCallbacks();
            callback(err);
        }
        // create peer
        this.peer = new Peer(PRE_CONNECTION_CODE + connectionCode, CONNECTION_PROPS);
        this.peer.on('open', openCallback);
        this.peer.on('error', errorCallback);
    }

    /**
     * Helper to generate a random connection code.
     */
    private generateRandomConnectionCode(): string {
        let result = '';
        for (let i = 0; i < this.connectionCodeLength; i++) {
            result += this.codeCharacters.charAt(Math.floor(Math.random() * this.codeCharacters.length));
        }
        return result;
    }

    /**
     * Removes given hosted connection from server.
     * 
     * @param client 
     */
    removeHostedConnection(client: HostedConnection) {
        let index = this.clients.indexOf(client);
        if (index > -1) {
            this.events.emit('client_disconnected', client);
            this.clients.splice(index, 1);
        }
    }

    /* Callbacks */

    private onButtonUpdate = () => {

    }
    
    /**
     * Called as new peer connection is initiated.
     * Creates a new HostedConnection for the new client.
     * 
     * @param connection 
     */
    private onPeerConnection = (connection: DataConnection) => {
        let removeListeners = () => {
            connection.off('open', onOpenCallback);
            connection.off('error', onErrorCallback);
        }
        let onOpenCallback = () => {
            removeListeners();

            // create new hosted connection and store in client array
            let client = new HostedConnection(this, connection);
            // add client listeners
            client.events.on('buttonUpdate', this.onButtonUpdate);
            if (!this.clients) {
                this.clients = [];
            }
            this.clients.push(client);
            this.events.emit('client_connected', client);
        };
        let onErrorCallback = (err) => {
            removeListeners();
            console.error('Connection err', err);
        };
        connection.on('open', onOpenCallback);
        connection.on('error', onOpenCallback);
    }

    /* Getter and Setter */
    
    get connectionCode(): string {
        return this._connectionCode;
    }

}
