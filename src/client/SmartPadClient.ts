
import Peer, { DataConnection } from 'peerjs';
import { PRE_ID, Message, CONNECTION_PROPS } from './../globals';
import { AbstractPeerConnection } from './../AbstractPeerConnection';
import EventEmitter from 'eventemitter3';


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

    readonly events: EventEmitter<'peerError' | 'peerClose' | 'connectionError' | 'connectionClose'> = new EventEmitter();

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
        console.log('Connecting...');
        this._isConnecting = true;
        return new Promise((resolve, reject) => {
            // create new peer
            this.peer = new Peer(CONNECTION_PROPS);

            this.peer.on('open', (id: string) => {
                console.log('peer open ', id);

                this.connection = this.peer.connect(PRE_ID + connectionCode);
                    
                // remove temporary event listener
                let removeTemporaryEventListeners = () => {
                    this.connection.off('open', onConnectionOpen);
                    this.connection.off('error', onPeerError);
                }
                // listen for open
                let onConnectionOpen = () => {
                    console.log('Connection successfull.');
                    removeTemporaryEventListeners();
                    this.initConnectedPeer();
                    resolve(this);
                }
                // listen for error
                let onPeerError = (err: any) => {
                    console.error('Error on opening peer connection', err);
                    removeTemporaryEventListeners();
                    this.peer.destroy();
                    this.peer = null;
                    reject(err);
                }
                // listen to open and error event of connect
                this.connection.on('open', onConnectionOpen);
                this.connection.on('close', () => {
                    console.error('pre close');
                });
                this.connection.on('data', () => {
                    console.error('pre on data');
                })
                this.connection.on('error', (err) => {
                    console.error('pre error: ', err);
                });
                this.peer.on('error', onPeerError);
                this.peer.on('close', () => {
                    console.error('peer pre on close');
                });
                this.peer.on('open', (id: string) => {
                    console.error('peer open', id);
                });
                this.peer.on('connection', () => {
                    console.error('peer pre conn');
                })
            });

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
        console.log('on connection close')
        this.events.emit('connectionClose');
    }
    protected onConnectionError(err: any): void {
        console.error('Connection error: ', err);
        this.events.emit('connectionError', err);
    }

    private onPeerClose = () => {
        console.log('on peer close');
        this.events.emit('peerClose');
    }

    private onPeerError = (err: any) => {
        console.error('Peer error: ', err);
        this.events.emit('peerError', err);
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
