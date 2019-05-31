"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Specifications follow https://www.w3.org/TR/gamepad/#gamepad-interface.
 *
 * Implementation of the native Gamepad implementation.
 */
var RemoteGamepad = /** @class */ (function () {
    function RemoteGamepad(client, api) {
        var _this = this;
        /*
        readonly attribute DOMString id;
        readonly attribute long index;
        readonly attribute boolean connected;
        readonly attribute DOMHighResTimeStamp timestamp;
        readonly attribute GamepadMappingType mapping;
        readonly attribute FrozenArray<double> axes;
        readonly attribute FrozenArray<GamepadButton> buttons;
        */
        this.hand = "";
        this.id = "<no id>";
        this.index = -1;
        this.mapping = "standard";
        this.pose = null;
        this.displayId = -1;
        this.connected = true;
        this.timestamp = window.performance.now();
        this.axes = [
            0,
            0,
            0,
            0 // pad right y1
        ];
        /**
         * 20 Gamepad buttons.
         * readonly attribute boolean pressed;
         * readonly attribute boolean touched; // mirror pressed value
         * readonly attribute double value;    // mirror pressed (0 <= value <= 1)
         */
        this.buttons = [
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false },
            { pressed: false, value: 0, touched: false }
        ];
        /* Callbacks */
        this.disconnect = function () {
            _this.connected = false;
            // remove gamepad
            _this.api.gamepads[_this.index] = undefined;
            var event = new CustomEvent('gamepaddisconnected', {});
            event.gamepad = _this; // add gamepad to event
            window.dispatchEvent(event);
        };
        this.onButtonUpdate = function (buttonIndex, pressed) {
            _this.updateButton(buttonIndex, pressed);
        };
        this.onAxisUpdate = function (axisIndex, value) {
            _this.timestamp = window.performance.now();
            _this.axes[axisIndex] = value;
        };
        this.remote = client;
        this.api = api;
        this.registerClientListeners();
    }
    RemoteGamepad.prototype.registerClientListeners = function () {
        this.remote.events.on('buttonUpdate', this.onButtonUpdate);
        this.remote.events.on('axisUpdate', this.onAxisUpdate);
        this.remote.events.on('disconnect', this.disconnect);
    };
    RemoteGamepad.prototype.updateButton = function (buttonId, pressed) {
        // update gamepad timestamp
        this.timestamp = window.performance.now();
        // get button
        var button = this.buttons[buttonId];
        if (!button) {
            // define new button with an id to enable customized buttons
            button = { pressed: false, value: 0, touched: false };
            this.buttons[buttonId] = button;
        }
        button.pressed = pressed;
        // mirror touched and value
        // https://www.w3.org/TR/gamepad/#gamepadbutton-interface
        button.touched = pressed;
        button.value = pressed ? 1 : 0;
    };
    return RemoteGamepad;
}());
exports.RemoteGamepad = RemoteGamepad;
