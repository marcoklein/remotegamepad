"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmartPadServer_1 = require("../network/server/SmartPadServer");
var RemoteGamepad_1 = require("./RemoteGamepad");
/**
 * Maps on native web gamepad API.
 */
var NetworkGamepadAPIClass = /** @class */ (function () {
    function NetworkGamepadAPIClass() {
        var _this = this;
        /**
         * Simulated gamepads.
         */
        this.gamepads = [];
        /**
         * Simulated and native gamepads.
         */
        this.combinedGamepads = [];
        /**
         * Connected clients are added to a waiting list.
         * Call processWaitingGamepads() to add them.
         */
        this.waitingGamepads = [];
        this.nativeGetGamepads = window.navigator.getGamepads.bind(navigator);
        /**
         * Assign own function to getGamepads().
         */
        window.navigator.getGamepads = function () {
            var nativeGamepads = _this.nativeGetGamepads();
            // traverse through all available gamepads
            var length = Math.max(nativeGamepads.length, _this.gamepads.length);
            // load combined gamepads
            for (var i = 0; i < length; i++) {
                _this.combinedGamepads[i] = _this.gamepads[i] || nativeGamepads[i] || null;
            }
            // if length of all gamepads is larger then splice rest of gamepads
            if (length < _this.combinedGamepads.length) {
                _this.combinedGamepads.splice(length);
            }
            return _this.combinedGamepads;
        };
        // create and start smart pad server
        var server = new SmartPadServer_1.SmartPadServer();
        server.start('catchme2');
        server.events.on('client_connected', function (client) {
            console.log('client connected');
            var gamepad = new RemoteGamepad_1.RemoteGamepad(client, _this);
            _this.waitingGamepads.push(gamepad);
            _this.processWaitingGamepads();
        });
        server.events.on('client_disconnected', function (client) {
            // TODO remove gamepad with client connection 
        });
        console.log('Smartphone gamepad library initialized.');
    }
    /**
     * There can always be only one instance of the API.
     */
    NetworkGamepadAPIClass.getInstance = function () {
        if (!NetworkGamepadAPIClass._instance) {
            NetworkGamepadAPIClass._instance = new NetworkGamepadAPIClass();
        }
        return NetworkGamepadAPIClass._instance;
    };
    /**
     * Searches next available gamepad index.
     */
    NetworkGamepadAPIClass.prototype.findNextGamepadIndex = function () {
        for (var i = 0; i < this.gamepads.length; i++) {
            if (!this.gamepads[i]) {
                return i;
            }
        }
        // return next available gamepad index
        return this.gamepads.length;
    };
    NetworkGamepadAPIClass.prototype.processWaitingGamepads = function () {
        while (this.waitingGamepads.length > 0) {
            var nextIndex = this.findNextGamepadIndex();
            // process next gamepad
            var gamepad = this.waitingGamepads.shift();
            this.gamepads[nextIndex] = gamepad;
            gamepad.index = nextIndex;
            // fire gamepad connected event
            var event_1 = new CustomEvent('gamepadconnected', {});
            event_1.gamepad = gamepad; // add gamepad to event
            window.dispatchEvent(event_1);
            console.log('dispatched gamepadconnected event');
        }
    };
    return NetworkGamepadAPIClass;
}());
exports.NetworkGamepadAPIClass = NetworkGamepadAPIClass;
