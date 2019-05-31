import { Message } from "../globals";
import { DataConnection } from "peerjs";
export declare abstract class AbstractPeerConnection {
    /**
     * Data channel for communication.
     */
    private _connection;
    /**
     * All sent messages get a unique id (counter).
     */
    protected lastMessageId: number;
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    private _sendKeepAlive;
    private keepAliveTimeout;
    /**
     * Keep alive interval in milliseconds.
     */
    private keepAliveInterval;
    private lastPingId;
    private lastPingStart;
    private _lastPing;
    numberOfStoredPings: number;
    private _pings;
    private _averagePing;
    constructor();
    protected abstract onMessage(msg: Message): void;
    protected abstract onConnectionClose(): void;
    protected abstract onConnectionError(err: any): void;
    sendMessage(type: string, data?: any, reliable?: boolean): number;
    /**
     * Sends given message and returns id.
     *
     * @param message
     * @param reliable
     */
    sendMessage(message: Message, reliable?: boolean): number;
    /**
     * Internal helper to track reliable messages and ensure delivery.
     *
     * @param message
     */
    private sendMessageReliably;
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    turnOnKeepAlive(): void;
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    turnOffKeepAlive(): void;
    /**
     * Send keep alives with ping messages.
     */
    private sendKeepAliveMessage;
    private handlePongMessage;
    private onConnectionDataCallback;
    private onConnectionCloseCallback;
    private onConnectionErrorCallback;
    connection: DataConnection;
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    readonly sendKeepAlive: boolean;
    readonly lastPing: number;
    readonly averagePing: number;
}
