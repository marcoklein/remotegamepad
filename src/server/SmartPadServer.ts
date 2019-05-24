
import Peer, { DataConnection } from 'peerjs';
import { PRE_ID as PRE_CONNECTION_CODE } from '../globals';

export class SmartPadServer {

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
    
    /**
     * Creates a new server.
     */
    constructor() {

    }


    
    handleClientConnect() {

    }

    /**
     * Inits server by generating a connection code and setting up listeners.
     */
    start(numberOfRetries: number = 10): Promise<string> {
        if (this.startingServer || this.peer) {
            throw new Error('Server can not start twice. Call stop() if started.');
        }
        // prohibit second server starting to prevent errors
        this.startingServer = true;
        return new Promise((resolve, reject) => {
            let numberOfTries = 0;
            let establishConnection = () => {
                let code = this.generateRandomConnectionCode();
                this.openPeerWithId(code, (error) => {
                    if (!error) {
                        // release starting lock
                        this.startingServer = false;
                        this._connectionCode = code;
                        resolve(code);
                    } else {
                        numberOfTries++;
                        if (numberOfTries >= numberOfRetries) {
                            // return with an error
                            this.startingServer = false;
                            reject(error);
                            return;
                        }
                        // try again
                        establishConnection();
                    }
                });
            };

            establishConnection();
        })
    }

    /**
     * 
     * @param connectionCode 
     * @param callback 
     */
    private openPeerWithId(connectionCode: string, callback: (error?: any) => void) {
        let deregisterCallbacks = () => {
            this.peer.off('open', openCallback);
            this.peer.off('error', errorCallback);
        }
        // callback if peer with id could be created
        let openCallback = (id: string) => {
            deregisterCallbacks();
            callback();
        };
        // callback if peer with id could not be created
        let errorCallback = (err: any) => {
            deregisterCallbacks();
            callback(err);
        }
        // create peer
        this.peer = new Peer(PRE_CONNECTION_CODE + connectionCode);
        this.peer.on('open', openCallback);
        this.peer.on('error', errorCallback);
    }

    /**
     * Helper to generate a random connection code.
     */
    private generateRandomConnectionCode(numberOfCharacters = 5): string {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < numberOfCharacters; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    /* Getter and Setter */
    
    get connectionCode(): string {
        return this._connectionCode;
    }

}

/*
console.log('Creating new peer.');
let peer = new Peer('CATCHME2TFT');

peer.on('open', (id) => {
    console.log('Peer ready with id: ', id);
});

peer.on('connection', (conn) => {
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
    measurePing();
});*/