"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractPeerConnection_1 = require("../AbstractPeerConnection");
var eventemitter3_1 = __importDefault(require("eventemitter3"));
/**
 * A connected client.
 */
var HostedConnection = /** @class */ (function (_super) {
    __extends(HostedConnection, _super);
    /**
     * Create new HostedConnection instance.
     * Connection has to be already open.
     *
     * @param server
     * @param connection
     */
    function HostedConnection(server, connection) {
        var _this = _super.call(this) || this;
        _this.events = new eventemitter3_1.default();
        _this.server = server;
        _this.connection = connection;
        _this.id = connection.peer;
        _this.turnOnKeepAlive();
        return _this;
    }
    HostedConnection.prototype.removeFromServer = function () {
        this.connection.close();
        this.server.removeHostedConnection(this);
        this.events.emit('disconnect');
    };
    /* Callbacks */
    HostedConnection.prototype.onMessage = function (msg) {
        switch (msg.type) {
            case 'axisUpdate': {
                // axis updates are sent with one index and two axis
                var axisIndex = msg.data.index * 2;
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
    };
    HostedConnection.prototype.onConnectionClose = function () {
        console.log('hosted connection close');
        this.removeFromServer();
    };
    HostedConnection.prototype.onConnectionError = function (err) {
        console.log('hosted connection error: ', err);
        this.removeFromServer();
    };
    return HostedConnection;
}(AbstractPeerConnection_1.AbstractPeerConnection));
exports.HostedConnection = HostedConnection;
