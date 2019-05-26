
import Peer, { DataConnection } from 'peerjs';
import { listeners } from 'cluster';
import { PRE_ID, Message } from './globals';
import { AbstractPeerConnection } from './AbstractPeerConnection';


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
export class SmartPadClient extends AbstractPeerConnection {

    /**
     * Underlying peerjs connection.
     */
    protected peer: Peer;
    listeners: ConnectionListener[] = [];

    private _isConnecting: boolean;

    constructor() {
        super();
    }


    /**
     * Connects to a server using given connection code.
     * The connection code is provided by the server.
     * 
     * @param connectionCode 
     */
    connect(connectionCode: string): Promise<SmartPadClient> {
        if (this._isConnecting || this.peer) {
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
                this.initConnectedPeer();
                resolve(this);
            }
            // listen for error
            let onPeerError = (err: any) => {
                removeTemporaryEventListeners();
                this.peer.destroy();
                this.peer = null;
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
    private initConnectedPeer() {
        // peer listeners
        this.peer.on('error', this.onPeerError);
        this.peer.on('close', this.onPeerClose);
        
        // start keep alive process
        this.turnOnKeepAlive();
    }

    
    /* Callbacks */

    protected onMessage(msg: Message): void {
        console.log('on message', msg);
    }
    protected onConnectionClose(): void {
    }
    protected onConnectionError(err: any): void {
        console.error('Connection error: ', err);
    }

    private onPeerClose = () => {

    }

    private onPeerError = (err: any) => {
        console.error('Peer error: ', err);
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
