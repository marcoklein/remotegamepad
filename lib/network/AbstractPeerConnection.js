"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractPeerConnection = /** @class */ (function () {
    function AbstractPeerConnection() {
        var _this = this;
        /* Message Tracking */
        /**
         * All sent messages get a unique id (counter).
         */
        this.lastMessageId = 0;
        /**
         * Keep alive interval in milliseconds.
         */
        this.keepAliveInterval = 70;
        this._lastPing = -1;
        this.numberOfStoredPings = 20;
        this._pings = [];
        this._averagePing = -1;
        /* Callbacks */
        this.onConnectionDataCallback = function (msg) {
            if (msg.type) {
                // handle internal types
                switch (msg.type) {
                    case 'ping':
                        // send pong
                        _this.sendMessage('pong', { id: msg.id });
                        break;
                    case 'pong':
                        // handle pong message
                        _this.handlePongMessage(msg.data.id);
                        break;
                    default:
                        _this.onMessage(msg);
                }
            }
            else {
                console.warn('Messages with no type can not be processed.');
            }
        };
        this.onConnectionCloseCallback = function () {
            _this.onConnectionClose();
        };
        this.onConnectionErrorCallback = function (err) {
            _this.onConnectionError(err);
        };
    }
    AbstractPeerConnection.prototype.sendMessage = function (message, reliable, p3) {
        if (!this._connection.open) {
            console.warn('Tried to send message with closed connection.');
            return;
        }
        if (typeof message === 'string') {
            // first overload
            message = {
                type: message,
                data: reliable
            };
            reliable = p3;
        }
        // for second overload nothing changes
        // assign message id
        message.id = this.lastMessageId++;
        // send reliably, if set within message or parameter
        if (reliable || message.reliable) {
            message.reliable = reliable = true;
            this.sendMessageReliably(message);
        }
        else {
            // send through peer connection
            this._connection.send(message);
        }
        return message.id;
    };
    /**
     * Internal helper to track reliable messages and ensure delivery.
     *
     * @param message
     */
    AbstractPeerConnection.prototype.sendMessageReliably = function (message) {
        // TODO implement reliable transfere
        this._connection.send(message);
    };
    /* Keep alive options */
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    AbstractPeerConnection.prototype.turnOnKeepAlive = function () {
        this._sendKeepAlive = true;
        this.sendKeepAliveMessage();
    };
    /**
     * WebRTC connections are unreliable if data is sent sporadic.
     * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
     */
    AbstractPeerConnection.prototype.turnOffKeepAlive = function () {
        this._sendKeepAlive = false;
        clearTimeout(this.keepAliveTimeout);
    };
    /**
     * Send keep alives with ping messages.
     */
    AbstractPeerConnection.prototype.sendKeepAliveMessage = function () {
        var _this = this;
        // send ping message
        this.lastPingId = this.sendMessage('ping');
        this.lastPingStart = Date.now();
        // schedule next keep alive message
        this.keepAliveTimeout = setTimeout(function () {
            _this.sendKeepAliveMessage();
        }, this.keepAliveInterval);
    };
    AbstractPeerConnection.prototype.handlePongMessage = function (pingId) {
        this._lastPing = Date.now() - this.lastPingStart;
        // update pings
        this._pings.push(this._lastPing);
        // remove initial ping if too many
        while (this._pings.length > this.numberOfStoredPings) {
            this._pings.splice(0, 1);
        }
        // calculate average ping
        var total = this._pings.reduce(function (a, b) { return a + b; });
        this._averagePing = total / this._pings.length;
    };
    Object.defineProperty(AbstractPeerConnection.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        /* Getter and Setter */
        set: function (connection) {
            if (this._connection) {
                // remove event listeners from old connection
                this.connection.off('data', this.onConnectionDataCallback);
                this.connection.off('close', this.onConnectionCloseCallback);
                this.connection.off('error', this.onConnectionErrorCallback);
            }
            this._connection = connection;
            if (connection) {
                // add listeners to new connection
                this.connection.on('data', this.onConnectionDataCallback);
                this.connection.on('close', this.onConnectionCloseCallback);
                this.connection.on('error', this.onConnectionErrorCallback);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "sendKeepAlive", {
        /**
         * WebRTC connections are unreliable if data is sent sporadic.
         * Therefore, the client sends keep alive messages in short intervals to esnure a stable connection.
         */
        get: function () {
            return this._sendKeepAlive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "lastPing", {
        get: function () {
            return this._lastPing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "averagePing", {
        get: function () {
            return this._averagePing;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractPeerConnection;
}());
exports.AbstractPeerConnection = AbstractPeerConnection;
