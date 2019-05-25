import { SmartPadServer } from "./SmartPadServer";
import { DataConnection } from "peerjs";
import { Message } from "../globals";
import { AbstractPeerConnection } from "../AbstractPeerConnection";

/**
 * A connected client.
 */
export class HostedConnection extends AbstractPeerConnection {

    /**
     * Server that initiated the HostedConnection.
     */
    readonly server: SmartPadServer;
    readonly id: string;

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
    }

    /* Callbacks */

    
    protected onMessage(msg: Message): void {
        console.log('on message', msg);
    }
    protected onConnectionClose(): void {
        console.log('hosted connection close');
        this.removeFromServer();
    }
    protected onConnectionError(err: any): void {
        console.log('hosted connection error: ', err);
        this.removeFromServer();
    }



/*
            // measure ping continuously
            let pingStart: number;
            let measurePing = () => {
                console.log('send ping');
                pingStart = Date.now();
                conn.send('ping');
                setTimeout(() => {
                    measurePing();
                }, 1000);
            }
        
            conn.on('data', (data) => {
                console.log('received data: ', data);
                if (data === 'pong') {
                    // stop ping measure
                    console.log('received pong');
                    let ping = Date.now() - pingStart;
                    console.log('ping: ' + ping);
                    conn.send({t: 'ping', v: ping});
                } else if (data === 'ping') {
                    conn.send('pong');
                }
            });
            console.log('Another peer connected!', conn.peer);
            console.log('Sending welcome messsage.');
            conn.send('Welcome');
            measurePing();*/
}