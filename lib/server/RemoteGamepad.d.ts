import { HostedConnection } from "../network/server/HostedConnection";
import { NetworkGamepadAPIClass } from "./RemoteGamepadAPI";
/**
 * Specifications follow https://www.w3.org/TR/gamepad/#gamepad-interface.
 *
 * Implementation of the native Gamepad implementation.
 */
export declare class RemoteGamepad implements Gamepad {
    hand: GamepadHand;
    readonly hapticActuators: GamepadHapticActuator[];
    id: string;
    index: number;
    mapping: GamepadMappingType;
    pose: GamepadPose;
    readonly displayId: number;
    connected: boolean;
    timestamp: DOMHighResTimeStamp;
    readonly remote: HostedConnection;
    private readonly api;
    readonly axes: [number, number, number, number];
    /**
     * 20 Gamepad buttons.
     * readonly attribute boolean pressed;
     * readonly attribute boolean touched; // mirror pressed value
     * readonly attribute double value;    // mirror pressed (0 <= value <= 1)
     */
    readonly buttons: {
        pressed: boolean;
        value: number;
        touched: boolean;
    }[];
    constructor(client: HostedConnection, api: NetworkGamepadAPIClass);
    private registerClientListeners;
    updateButton(buttonId: number, pressed: boolean): void;
    private disconnect;
    private onButtonUpdate;
    private onAxisUpdate;
}
