
import Peer, { DataConnection } from 'peerjs';
import { listeners } from 'cluster';
import { PRE_ID, Message } from './globals';


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
    /**
     * All sent messages get a unique id (counter).
     */
    protected lastMessageId: number = 0;
    listeners: ConnectionListener[] = [];

    private _isConnecting: boolean;

    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    private _sendKeepAlive: boolean = true;
    private keepAliveTimeout: any;
    /**
     * Keep alive interval in milliseconds.
     */
    private keepAliveInterval: number = 70;


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

    sendMessage(type: string, data?: any, reliable?: boolean): number;
    /**
     * Sends given message and returns id.
     * 
     * @param message 
     * @param reliable
     */
    sendMessage(message: Message, reliable?: boolean): number;
    sendMessage(message: Message | string, reliable: boolean | any, p3?: boolean): number {
        console.log('sendMessage p1 type', typeof message);
        if (typeof message === 'string') {
            // first overload
            message = {
                type: message,
                data: reliable
            };
            reliable = p3;
        }
        // for second overload nothing changes

        // assign message id
        message.id = this.lastMessageId++;
        // send reliably, if set within message or parameter
        if (reliable || message.reliable) {
            message.reliable = reliable = true;
            this.sendMessageReliably(message);
        } else {
            // send through peer connection
            this.connection.send(message);
        }
        return message.id;
    }

    /**
     * Internal helper to track reliable messages and ensure delivery.
     * 
     * @param message 
     */
    private sendMessageReliably(message: Message) {
        // TODO implement reliable transfere
        this.connection.send(message);
    }

    /**
     * Called as the client freshly connects to the server.
     * Sets up event listeners.
     */
    private initConnectedPeer() {
        // peer listeners
        this.peer.on('error', this.onPeerError);
        this.peer.on('close', this.onPeerClose);
        // connection listeners
        this.connection.on('data', this.onConnectionData);
        this.connection.on('close', this.onConnectionClose);
        this.connection.on('error', this.onConnectionError);
        
        // start keep alive process
        if (this._sendKeepAlive) {
            this.turnOnKeepAlive();
        }
    }

    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    turnOnKeepAlive() {
        this._sendKeepAlive = true;
        this.sendKeepAliveMessage();
    }

    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    turnOffKeepAlive() {
        this._sendKeepAlive = false;
        clearTimeout(this.keepAliveTimeout);
    }


    /**
     * Send keep alives with ping messages.
     */
    private sendKeepAliveMessage() {
        // send ping message
        this.sendMessage('ping');

        // schedule next keep alive message
        this.keepAliveTimeout = setTimeout(() => {
            this.sendKeepAliveMessage();
        }, this.keepAliveInterval);
    }

    /*
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
    */

    
    /* Callbacks */

    private onConnectionData = (data: any) => {

    }

    private onConnectionClose = () => {

    }

    private onConnectionError = (err: any) => {

    }

    private onPeerClose = () => {

    }

    private onPeerError = (err: any) => {

    }

    /* Getter and Setter */

    /**
     * Returns true while client is trying to connect.
     * No new connection attempt can be made in the meanwhile.
     */
    get isConnecting(): boolean {
        return this._isConnecting;
    }
    
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    get sendKeepAlive(): boolean {
        return this._sendKeepAlive
    }

}
