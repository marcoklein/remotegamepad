import { Message } from "../globals";
import { DataConnection } from "peerjs";

/**
 * Super class of the client and server connection.
 * 
 * Implements basic message sending and keep alive functionality.
 * The keep alive mechanism is active per default and continuously exchanges ping pong messages.
 * This ensures that the WebRTC connection stays active and measures the latency.
 */
export abstract class AbstractPeerConnection {
    
    /**
     * Data channel for communication.
     */
    private _connection: DataConnection;
    

    /* Message Tracking */

    /**
     * All sent messages get a unique id (counter).
     */
    protected lastMessageId: number = 0;


    /* Keep Alive Feature */

    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    private _sendKeepAlive: boolean;
    /**
     * Timeout to send the next keep alive message.
     */
    private _keepAliveTimer: any;
    /**
     * Keep alive interval in milliseconds.
     */
    private keepAliveInterval: number = 100;

    /**
     * Number of milliseconds the connection waits before closing when sending a keep alive message.
     */
    private _connectionTimeout: number = 5000;
    private _connectionTimeoutTimer: any;


    private lastPingId: number;
    private lastPingStart: number;
    private _lastPing: number = -1;
    numberOfStoredPings: number = 20;
    private _pings: number[] = [];
    private _averagePing: number = -1;

    constructor() {
    }

    /* Abstract methods */
    
    protected abstract onMessage(msg: Message): void;

    protected abstract onConnectionClose(): void;

    protected abstract onConnectionError(err: any): void;

    /* Message methods */

    sendMessage(type: string, data?: any, reliable?: boolean): number;
    /**
     * Sends given message and returns id.
     * 
     * @param message 
     * @param reliable
     */
    sendMessage(message: Message, reliable?: boolean): number;
    sendMessage(message: Message | string, reliable: boolean | any, p3?: boolean): number {
        if (!this._connection.open) {
            console.warn('Tried to send message with closed connection.');
            return;
        }
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
            this._connection.send(message);
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
        this._connection.send(message);
    }

    /* Keep alive options */
    
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
        this.clearTimeouts();
    }

    private clearTimeouts() {
        clearTimeout(this._keepAliveTimer);
        clearTimeout(this._connectionTimeoutTimer);
    }


    /**
     * Send keep alives with ping messages.
     */
    private sendKeepAliveMessage() {
        // send ping message
        this.lastPingId = this.sendMessage('ping');
        this.lastPingStart = Date.now();

        // schedule next keep alive message
        this._keepAliveTimer = setTimeout(() => {
            this.sendKeepAliveMessage();
        }, this.keepAliveInterval);
    }

    private handlePongMessage(pingId: number) {
        this._lastPing = Date.now() - this.lastPingStart;
        // update pings
        this._pings.push(this._lastPing);
        // remove initial ping if too many
        while(this._pings.length > this.numberOfStoredPings) {
            this._pings.splice(0, 1);
        }
        // calculate average ping
        let total = this._pings.reduce((a, b) => { return a + b; });
        this._averagePing = total / this._pings.length;

        // reset connection timeout timer
        clearTimeout(this._connectionTimeoutTimer);
        this._connectionTimeoutTimer = setTimeout(() => {
            // close connection if the connection timeout is reached
            this._connection.close();
            console.log('manual connection close');
        }, this.connectionTimeout);
    }
    
    /* Callbacks */

    private onConnectionDataCallback = (msg: Message) => {
        if (msg.type) {
            // handle internal types
            switch (msg.type) {
                case 'ping':
                    // send pong
                    this.sendMessage('pong', { id: msg.id });
                    break;
                case 'pong':
                    // handle pong message
                    this.handlePongMessage(msg.data.id);
                    break;
                default:
                    this.onMessage(msg);
            }
        } else {
            console.warn('Messages with no type can not be processed.');
        }
    }

    private onConnectionCloseCallback = () => {
        this.clearTimeouts();
        this.onConnectionClose();
    }

    private onConnectionErrorCallback = (err: any) => {
        this.clearTimeouts();
        this.onConnectionError(err);
    }

    /* Getter and Setter */

    set connection(connection: DataConnection) {
        if (this._connection) {
            // remove event listeners from old connection
            this.connection.off('data', this.onConnectionDataCallback);
            this.connection.off('close', this.onConnectionCloseCallback);
            this.connection.off('error', this.onConnectionErrorCallback);
        }
        this._connection = connection;
        if (connection) {
            // add listeners to new connection
            this.connection.on('data', this.onConnectionDataCallback);
            this.connection.on('close', this.onConnectionCloseCallback);
            this.connection.on('error', this.onConnectionErrorCallback);
        }
    }

    /**
     * Internally used PeerJS DataConnection.
     */
    get connection(): DataConnection {
        return this._connection;
    }
    
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    get sendKeepAlive(): boolean {
        return this._sendKeepAlive;
    }

    get lastPing(): number {
        return this._lastPing;
    }

    get averagePing(): number {
        return this._averagePing;
    }

    set connectionTimeout(timeout: number) {
        this._connectionTimeout = timeout;
        clearTimeout(this._connectionTimeoutTimer);
    }

    get connectionTimeout(): number {
        return this._connectionTimeout;
    }
}