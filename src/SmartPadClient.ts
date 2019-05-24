
import Peer, { DataConnection } from 'peerjs';
import { listeners } from 'cluster';
import { PRE_ID } from './globals';


/**
 * Listen to changes within data connection.
 */
export interface ConnectionListener {

    connectionEstablished(): void;
    connectionLost(): void;
    connectionMessageUpdate(msg: string): void;

}

/**
 * Base class on client side to handle a server connection.
 */
export class SmartPadClient {
    /**
     * Underlying peerjs connection.
     */
    protected peer: Peer;
    protected connection: DataConnection;
    listeners: ConnectionListener[] = [];

    private _isConnecting: boolean;


    lastMeasuredPeerPing: number;
    lastPing: number;

    constructor() {
    }

    /**
     * Connects to a server using given connection code.
     * The connection code is provided by the server.
     * 
     * @param connectionCode 
     */
    connect(connectionCode: string): Promise<SmartPadClient> {
        if (this._isConnecting) {
            console.warn('Connection attempt during ongoing connection.');
            return;
        }
        this._isConnecting = true;
        return new Promise((resolve, reject) => {
            // create new peer
            this.peer = new Peer();
            this.connection = this.peer.connect(PRE_ID + connectionCode);

            // remove temporary event listener
            let removeTemporaryEventListeners = () => {
                this.connection.off('open', onConnectionOpen);
                this.connection.off('open', onPeerError);
            }
            // listen for open
            let onConnectionOpen = () => {
                removeTemporaryEventListeners();
                this.initConnectedClient();
                resolve(this);
            }
            // listen for error
            let onPeerError = (err: any) => {
                console.error('peer error');
                removeTemporaryEventListeners();
                reject(err);
            }
            // listen to open and error event of connect
            this.connection.on('open', onConnectionOpen);
            this.peer.on('error', onPeerError);
        });
    }

    /**
     * Called as the client freshly connects to the server.
     * Sets up event listeners.
     */
    private initConnectedClient() {
        console.log('connection!');
    }

    
    oldconnect(connectionId: string) {
        // initiate peer connection
        this.connection = this.peer.connect(connectionId);

        this.peer.on('connection', (data) => {
            console.log('peer on connection');
        });
        this.peer.on('open', (id) => {
            console.log('peer open, id: ', id);
            this.notifyConnectionMessageUpdate('Peer open. Ready to connect.');
        });
        this.peer.on('error', (err) => {
            console.error('error: ', err);
            this.notifyConnectionLost();
            this.notifyConnectionMessageUpdate('Connection lost due to peer error.');
        });
        this.connection.on('open', () => {
            this.notifyConnectionMessageUpdate('Connection successfull!');
            console.log('connection successfull');
            console.log('buffer size: ' + this.connection.bufferSize);
            // measure latency by sending ping requests
            let pingStart: number;
            let measurePing = () => {
                // send ping
                pingStart = Date.now();
                this.connection.send('ping');
                setTimeout(() => {
                    // ping every second
                    measurePing();
                }, 70);
            }

            // listen for incoming data
            this.connection.on('data', (data) => {
                console.log('received data: ', data);
                if (data === 'ping') {
                    this.connection.send('pong');
                } else if (data === 'pong') {
                    // received pong
                    this.lastPing = Date.now() - pingStart;
                } else if (typeof data === 'object') {
                    data = <{t: any, v: any}> data;
                    if (data.t === 'ping') {
                        // received last ping value
                        this.lastMeasuredPeerPing = data.v;
                    }
                }
                
            });

            measurePing();
        });
        this.connection.on('close', () => {
            console.log('Connection closed');
            this.notifyConnectionLost();
        });
        this.connection.on('error', (err) => {
            console.error('Connection error');
            this.notifyConnectionLost();
        });
    }

    addListener(connListener: ConnectionListener) {
        this.listeners.push(connListener);
    }

    private notifyConnectionEstablished() {
        this.listeners.forEach((listener) => {
            if (listener.connectionEstablished) {
                listener.connectionEstablished();
            }
        });
    }
    
    private notifyConnectionLost() {
        this.listeners.forEach((listener) => {
            if (listener.connectionLost) {
                listener.connectionLost();
            }
        });
    }

    private notifyConnectionMessageUpdate(msg: string) {
        this.listeners.forEach((listener) => {
            if (listener.connectionMessageUpdate) {
                listener.connectionMessageUpdate(msg);
            }
        });
    }

    /* Getter and Setter */

    /**
     * Returns true while client is trying to connect.
     * No new connection attempt can be made in the meanwhile.
     */
    get isConnecting(): boolean {
        return this._isConnecting;
    }

}
