import { SmartPadServer } from "./SmartPadServer";
import { DataConnection } from "peerjs";

/**
 * A connected client.
 */
export class HostedConnection {

    /**
     * Server that initiated the HostedConnection.
     */
    readonly server: SmartPadServer;
    /**
     * Data channel for communication.
     */
    readonly connection: DataConnection;
    readonly id: string;

    constructor(server: SmartPadServer, connection: DataConnection) {
        this.server = server;
        this.connection = connection;
        this.id = connection.peer;

        this.initListeners();
    }

    private initListeners() {
        this.connection.on('data', this.onData);
        this.connection.on('close', this.onClose);
        this.connection.on('error', this.onError);
    }

    private removeFromServer() {
        this.connection.close();
        this.server.removeHostedConnection(this);
    }

    /* Callbacks */

    private onData = (data: any) => {
        console.log('hosted connection data');
    }

    private onClose = () => {
        console.log('hosted connection close');
        this.removeFromServer();
    }

    private onError = (err: any) => {
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