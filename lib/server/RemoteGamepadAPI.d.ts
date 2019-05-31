import { RemoteGamepad } from "./RemoteGamepad";
/**
 * Maps on native web gamepad API.
 */
export declare class NetworkGamepadAPIClass {
    private static _instance;
    /**
     * There can always be only one instance of the API.
     */
    static getInstance(): NetworkGamepadAPIClass;
    /**
     * Simulated gamepads.
     */
    gamepads: Array<Gamepad | RemoteGamepad>;
    /**
     * Simulated and native gamepads.
     */
    combinedGamepads: Array<Gamepad | RemoteGamepad>;
    /**
     * Connected clients are added to a waiting list.
     * Call processWaitingGamepads() to add them.
     */
    waitingGamepads: RemoteGamepad[];
    /**
     * Remap original gamepad function.
     */
    private readonly nativeGetGamepads;
    private constructor();
    /**
     * Searches next available gamepad index.
     */
    findNextGamepadIndex(): number;
    processWaitingGamepads(): void;
}
