import { SmartPadServer } from "./SmartPadServer";
import { DataConnection } from "peerjs";
import { Message } from "../../globals";
import { AbstractPeerConnection } from "../AbstractPeerConnection";
import EventEmitter from 'eventemitter3';
/**
 * A connected client.
 */
export declare class HostedConnection extends AbstractPeerConnection {
    /**
     * Server that initiated the HostedConnection.
     */
    readonly server: SmartPadServer;
    readonly id: string;
    readonly events: EventEmitter<'buttonUpdate' | 'axisUpdate' | 'disconnect'>;
    /**
     * Create new HostedConnection instance.
     * Connection has to be already open.
     *
     * @param server
     * @param connection
     */
    constructor(server: SmartPadServer, connection: DataConnection);
    private removeFromServer;
    protected onMessage(msg: Message): void;
    protected onConnectionClose(): void;
    protected onConnectionError(err: any): void;
}
