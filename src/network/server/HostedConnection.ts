import { RemoteGamepadServer } from "./RemoteGamepadServer";
import { DataConnection } from "peerjs";
import { Message } from "../../globals";
import { AbstractPeerConnection } from "../AbstractPeerConnection";
import EventEmitter from 'eventemitter3';

/**
 * A connected client.
 */
export class HostedConnection extends AbstractPeerConnection {

    /**
     * Server that initiated the HostedConnection.
     */
    readonly server: RemoteGamepadServer;
    /**
     * Unique id of the HostedConnection. Same as the client machine uses.
     */
    readonly id: string;
    /**
     * Listen to certain events of the remote gamepad.
     */
    readonly events: EventEmitter<'buttonUpdate' | 'axisUpdate' | 'disconnect'> = new EventEmitter();

    /**
     * Create new HostedConnection instance.
     * Connection has to be already open.
     * 
     * @param server 
     * @param connection 
     */
    constructor(server: RemoteGamepadServer, connection: DataConnection) {
        super();
        this.server = server;
        this.connection = connection;
        this.id = connection.peer;

        this.turnOnKeepAlive();
    }


    /**
     * Remves this HostedConnection from its server.
     * The method closes the connection and emits the disconnect event.
     */
    private removeFromServer() {
        this.connection.close();
        this.server.removeHostedConnection(this);
        this.events.emit('disconnect');
    }

    /* Callbacks */

    
    protected onMessage(msg: Message): void {
        switch (msg.type) {
            case 'axisUpdate': {
                // axis updates are sent with one index and two axis
                let axisIndex = msg.data.index * 2;
                this.events.emit('axisUpdate', axisIndex, msg.data.x);
                this.events.emit('axisUpdate', axisIndex + 1, msg.data.y);
                break;
            }
            case 'buttonUpdate': {
                this.events.emit('buttonUpdate', msg.data.index, msg.data.pressed);
                break;
            }
            default: {
                console.warn('Unhandled message type: ', msg.type);
            }
        }
    }
    protected onConnectionClose(): void {
        console.log('hosted connection close');
        this.removeFromServer();
    }
    protected onConnectionError(err: any): void {
        console.log('hosted connection error: ', err);
        this.removeFromServer();
    }

}