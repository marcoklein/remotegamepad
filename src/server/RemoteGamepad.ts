import { HostedConnection } from "./HostedConnection";

/**
 * Specifications follow https://www.w3.org/TR/gamepad/#gamepad-interface.
 * 
 */
export class RemoteGamepad implements Gamepad {

    /*
    readonly attribute DOMString id;
    readonly attribute long index;
    readonly attribute boolean connected;
    readonly attribute DOMHighResTimeStamp timestamp;
    readonly attribute GamepadMappingType mapping;
    readonly attribute FrozenArray<double> axes;
    readonly attribute FrozenArray<GamepadButton> buttons;
    */

    hand: GamepadHand = "";
    hapticActuators: readonly GamepadHapticActuator[];
    id: string = "<no id>";
    index: number = -1;
    mapping: GamepadMappingType = "standard";
    pose: GamepadPose = null;

    connected: boolean = false;
    timestamp: DOMHighResTimeStamp = window.performance.now();

    readonly client: HostedConnection;

    readonly axes: [number, number, number, number] = [
        0, // pad left  x0
        0, // pad left  y0
        0, // pad right x1
        0  // pad right y1
    ];

    /**
     * 20 Gamepad buttons.
     * readonly attribute boolean pressed;
     * readonly attribute boolean touched; // mirror pressed value
     * readonly attribute double value;    // mirror pressed (0 <= value <= 1)
     */
    readonly buttons: { pressed: boolean, value: number, touched: boolean }[] = [
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

    constructor(client: HostedConnection) {
        this.client = client;
        this.registerClientListeners();
    }

    private registerClientListeners() {
        this.client.events.on('buttonUpdate', this.onButtonUpdate);
        this.client.events.on('axisUpdate', this.onAxisUpdate);
        this.client.events.on('disconnect', this.disconnect);
    }



    updateButton(buttonId: number, pressed: boolean) {
        // update gamepad timestamp
        this.timestamp = window.performance.now();
        // get button
        let button = this.buttons[buttonId];
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
    }

    /* Callbacks */

    
    private disconnect = () => {
        this.connected = false;
        let event = new CustomEvent('gamepaddisconnected', {});
        (<any> event).gamepad = this; // add gamepad to event
        window.dispatchEvent(event);
    }

    private onButtonUpdate = (buttonIndex: number, pressed: boolean) => {
        this.updateButton(buttonIndex, pressed);
    }
    
    private onAxisUpdate = (axisIndex: number, value: number) => {
        this.axes[axisIndex] = value;
    }
}