
import Peer from 'peerjs';
import { PRE_ID, Message, CONNECTION_PROPS } from '../../globals';
import { AbstractPeerConnection } from '../AbstractPeerConnection';
import EventEmitter from 'eventemitter3';


/**
 * Listen to changes within data connection.
 */
export interface ConnectionListener {

    connectionEstablished(): void;
    connectionLost(): void;
    connectionMessageUpdate(msg: string): void;

}

/**
 * Base class on client side to handle a server connection.
 */
export class RemoteGamepadClient extends AbstractPeerConnection {

    /**
     * Underlying peerjs connection.
     */
    protected peer: Peer;
    private listeners: ConnectionListener[] = [];

    private connectionPromise: Promise<RemoteGamepadClient>;
    private _isConnecting: boolean = false;

    readonly events: EventEmitter<'peerError' | 'peerClose' | 'connectionError' | 'connectionClose'> = new EventEmitter();

    debug: boolean = true;

    constructor() {
        super();
    }

    /**
     * Helper function to send a change to a button.
     * Uses the sendMessage() function internally with the type 'buttonUpdate'.
     * 
     * @param buttonId Index of the button. See https://www.w3.org/TR/gamepad/#remapping for all indices.
     * @param pressed True if the button is pressed. False if not.
     */
    sendButtonUpdate(buttonId: number, pressed: boolean) {
        this.sendMessage('buttonUpdate',
            {
                index: buttonId,
                pressed: pressed
            }
        );
    }
    
    /**
     * Helper function to send a change to an axis.
     * Uses the sendMessage() function internally with the type 'axisUpdate'.
     * 
     * Update either the axes of the left pad or the axes on the right pad.
     * X- and y-axes are always updated at the same time.
     * 
     * @param pad Pad position to update axes of. Either left or right one. See https://www.w3.org/TR/gamepad/#remapping for a visual.
     * @param x X-value of the axis.
     * @param y Y-value of the axis.
     */
    sendAxisUpdate(pad: "LeftPad" | "RightPad", x: number, y: number) {
        let axisId = pad === "LeftPad" ? 0 : 1;
        this.sendMessage('axisUpdate',
            {
                index: axisId,
                x: x,
                y: y
            }
        );
    }


    /**
     * Connects to a server using given connection code.
     * The connection code is provided by the server.
     * 
     * If the function is called during an ongoing connection the same Promise is returned.
     * 
     * @param connectionCode Connection code of the server.
     */
    connect(connectionCode: string): Promise<RemoteGamepadClient> {
        if (this._isConnecting || this.peer) {
            console.warn('Connection attempt during ongoing connection.');
            return this.connectionPromise;
        }
        if (this.debug) console.log('Connecting...');
        this._isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
            // create new peer
            this.peer = new Peer(CONNECTION_PROPS);

            // attach listeners
            this.peer.on('open', (id: string) => {
                if (this.debug) console.log('peer open ', id);

                // establish connection with open peer
                this.connection = this.peer.connect(PRE_ID + connectionCode);
                    
                // remove temporary event listener
                let removeTemporaryEventListeners = () => {
                    this.connection.off('open', onConnectionOpen);
                    this.connection.off('error', onPeerError);
                }
                // listen for open
                let onConnectionOpen = () => {
                    if (this.debug) console.log('Connection successfull.');
                    removeTemporaryEventListeners();
                    this.initConnectedPeer();
                    this._isConnecting = false;
                    resolve(this);
                }
                // listen for error
                let onPeerError = (err: any) => {
                    console.error('Error on opening peer connection', err);
                    removeTemporaryEventListeners();
                    this.peer.destroy();
                    this.peer = null;
                    this._isConnecting = false;
                    reject(err);
                }
                // listen to open and error event of connect
                this.connection.on('open', onConnectionOpen);
                /*this.connection.on('close', () => {
                    console.error('pre close');
                });
                this.connection.on('data', () => {
                    console.error('pre on data');
                })
                this.connection.on('error', (err) => {
                    console.error('pre error: ', err);
                });*/
                this.peer.on('error', onPeerError);
                /*this.peer.on('close', () => {
                    console.error('peer pre on close');
                });
                this.peer.on('open', (id: string) => {
                    console.error('peer open', id);
                });
                this.peer.on('connection', () => {
                    console.error('peer pre conn');
                });*/
            });

        });

        return this.connectionPromise;
    }

    /**
     * Called as the client freshly connects to the server.
     * Sets up event listeners.
     */
    private initConnectedPeer() {
        // peer listeners
        this.peer.on('error', this.onPeerError);
        this.peer.on('close', this.onPeerClose);
        
        // start keep alive process
        this.turnOnKeepAlive();
    }

    
    /* Callbacks */

    protected onMessage(msg: Message): void {
        if (this.debug) console.log('on message', msg);
    }
    protected onConnectionClose(): void {
        if (this.debug) console.log('on connection close')
        this.events.emit('connectionClose');
    }
    protected onConnectionError(err: any): void {
        console.error('Connection error: ', err);
        this.events.emit('connectionError', err);
    }

    private onPeerClose = () => {
        if (this.debug) console.log('on peer close');
        this.events.emit('peerClose');
    }

    private onPeerError = (err: any) => {
        console.error('Peer error: ', err);
        this.events.emit('peerError', err);
    }

    /* Getter and Setter */

    /**
     * Returns true while client is trying to connect.
     * No new connection attempt can be made in the meanwhile.
     */
    get isConnecting(): boolean {
        return this._isConnecting;
    }
    

}
