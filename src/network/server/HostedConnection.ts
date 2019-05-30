import { SmartPadServer } from "./SmartPadServer";
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
    readonly server: SmartPadServer;
    readonly id: string;
    readonly events: EventEmitter<'buttonUpdate' | 'axisUpdate' | 'disconnect'> = new EventEmitter();

    /**
     * Create new HostedConnection instance.
     * Connection has to be already open.
     * 
     * @param server 
     * @param connection 
     */
    constructor(server: SmartPadServer, connection: DataConnection) {
        super();
        this.server = server;
        this.connection = connection;
        this.id = connection.peer;

        this.turnOnKeepAlive();
    }


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
                this.events.emit('axisUpdate', axisIndex, msg.data.axis.x);
                this.events.emit('axisUpdate', axisIndex + 1, msg.data.axis.y);
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