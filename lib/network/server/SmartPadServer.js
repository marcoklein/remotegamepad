"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var peerjs_1 = __importDefault(require("peerjs"));
var globals_1 = require("../../globals");
var HostedConnection_1 = require("./HostedConnection");
var eventemitter3_1 = __importDefault(require("eventemitter3"));
/**
 * Buttons follow official W3C HTML Gamepad Specifications from
 * https://www.w3.org/TR/gamepad/#remapping
 */
var SmartPadServer = /** @class */ (function () {
    /**
     * Creates a new server.
     */
    function SmartPadServer() {
        var _this = this;
        this.events = new eventemitter3_1.default();
        /* Callbacks */
        this.onButtonUpdate = function () {
        };
        /**
         * Called as new peer connection is initiated.
         * Creates a new HostedConnection for the new client.
         *
         * @param connection
         */
        this.onPeerConnection = function (connection) {
            var removeListeners = function () {
                connection.off('open', onOpenCallback);
                connection.off('error', onErrorCallback);
            };
            var onOpenCallback = function () {
                removeListeners();
                // create new hosted connection and store in client array
                var client = new HostedConnection_1.HostedConnection(_this, connection);
                // add client listeners
                client.events.on('buttonUpdate', _this.onButtonUpdate);
                if (!_this.clients) {
                    _this.clients = [];
                }
                _this.clients.push(client);
                _this.events.emit('client_connected', client);
            };
            var onErrorCallback = function (err) {
                removeListeners();
                console.error('Connection err', err);
            };
            connection.on('open', onOpenCallback);
            connection.on('error', onOpenCallback);
        };
    }
    /**
     * Inits server by generating a connection code and setting up listeners.
     */
    SmartPadServer.prototype.start = function (connectionCode, numberOfRetries) {
        var _this = this;
        if (numberOfRetries === void 0) { numberOfRetries = 10; }
        if (this.startingServer || this.peer) {
            throw new Error('Server can not start twice. Call stop() if started.');
        }
        // reset clients
        this.clients = [];
        // prohibit second server starting to prevent errors
        this.startingServer = true;
        return new Promise(function (resolve, reject) {
            var numberOfTries = 0;
            var establishConnection = function () {
                var code = connectionCode || _this.generateRandomConnectionCode();
                _this.openPeerWithId(code, function (error) {
                    if (!error) {
                        // release starting lock
                        _this.startingServer = false;
                        _this._connectionCode = code;
                        _this.initNewServerPeer();
                        resolve(code);
                    }
                    else {
                        numberOfTries++;
                        if (numberOfTries >= numberOfRetries) {
                            // return with an error
                            _this.startingServer = false;
                            _this.peer.destroy();
                            _this.peer = null;
                            reject(error);
                            return;
                        }
                        // try again
                        establishConnection();
                    }
                });
            };
            establishConnection();
        });
    };
    /**
     * After successfull registration of a server peer event listeners need to be registered.
     */
    SmartPadServer.prototype.initNewServerPeer = function () {
        this.peer.on('connection', this.onPeerConnection);
    };
    /**
     *
     * @param connectionCode
     * @param callback
     */
    SmartPadServer.prototype.openPeerWithId = function (connectionCode, callback) {
        var _this = this;
        var deregisterCallbacks = function () {
            _this.peer.off('open', openCallback);
            _this.peer.off('error', errorCallback);
        };
        // callback if peer with id could be created
        var openCallback = function (id) {
            deregisterCallbacks();
            callback();
        };
        // callback if peer with id could not be created
        var errorCallback = function (err) {
            deregisterCallbacks();
            callback(err);
        };
        // create peer
        this.peer = new peerjs_1.default(globals_1.PRE_ID + connectionCode, globals_1.CONNECTION_PROPS);
        this.peer.on('open', openCallback);
        this.peer.on('error', errorCallback);
    };
    /**
     * Helper to generate a random connection code.
     */
    SmartPadServer.prototype.generateRandomConnectionCode = function (numberOfCharacters) {
        if (numberOfCharacters === void 0) { numberOfCharacters = 5; }
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < numberOfCharacters; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    /**
     * Removes given hosted connection from server.
     *
     * @param client
     */
    SmartPadServer.prototype.removeHostedConnection = function (client) {
        var index = this.clients.indexOf(client);
        if (index > -1) {
            this.events.emit('client_disconnected', client);
            this.clients.splice(index, 1);
        }
    };
    Object.defineProperty(SmartPadServer.prototype, "connectionCode", {
        /* Getter and Setter */
        get: function () {
            return this._connectionCode;
        },
        enumerable: true,
        configurable: true
    });
    return SmartPadServer;
}());
exports.SmartPadServer = SmartPadServer;
