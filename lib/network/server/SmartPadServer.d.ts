import Peer from 'peerjs';
import { HostedConnection } from './HostedConnection';
import EventEmitter from 'eventemitter3';
/**
 * Buttons follow official W3C HTML Gamepad Specifications from
 * https://www.w3.org/TR/gamepad/#remapping
 */
export declare class SmartPadServer {
    /**
     * Server side WebRTC peer.
     */
    peer: Peer;
    /**
     * Connection code for client this server has.
     * Is set during start().
     */
    _connectionCode: string;
    startingServer: boolean;
    clients: HostedConnection[];
    events: EventEmitter<'client_connected' | 'client_disconnected'>;
    /**
     * Creates a new server.
     */
    constructor();
    /**
     * Inits server by generating a connection code and setting up listeners.
     */
    start(connectionCode?: string, numberOfRetries?: number): Promise<string>;
    /**
     * After successfull registration of a server peer event listeners need to be registered.
     */
    private initNewServerPeer;
    /**
     *
     * @param connectionCode
     * @param callback
     */
    private openPeerWithId;
    /**
     * Helper to generate a random connection code.
     */
    private generateRandomConnectionCode;
    /**
     * Removes given hosted connection from server.
     *
     * @param client
     */
    removeHostedConnection(client: HostedConnection): void;
    private onButtonUpdate;
    /**
     * Called as new peer connection is initiated.
     * Creates a new HostedConnection for the new client.
     *
     * @param connection
     */
    private onPeerConnection;
    readonly connectionCode: string;
}
