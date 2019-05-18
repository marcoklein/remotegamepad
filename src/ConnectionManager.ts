
import Peer, { DataConnection } from 'peerjs';


export class ConnectionManager {
    peer: Peer;
    connection: DataConnection;

    constructor() {
        this.peer = new Peer({debug: 2});
    }

    connect(id: string) {
        // initiate peer connection
        this.connection = this.peer.connect('CATCHME2');

        this.peer.on('connection', (data) => {
            console.log('peer on connection');
        });
        this.peer.on('open', (id) => {
            console.log('peer open, id: ', id);
        });
        this.peer.on('error', (err) => {
            console.error('error: ', err);
        });
        this.connection.on('open', () => {
            console.log('connection successfull');
            this.connection.on('data', (data) => {
                console.log('received data: ', data);
                if (data === 'ping') {
                    this.connection.send('pong');
                }
                
                // TODO extract ping from message
                /*let custEvent = new CustomEvent('ping', {
                    ping: ping
                });
                window.dispatchEvent(custEvent);*/
            });
            this.connection.send('hellooo');
        });
        this.connection.on('close', () => {
            console.log('Connection closed');
        });
        this.connection.on('error', (err) => {
            console.error('Connection error');
        });
    }

}
