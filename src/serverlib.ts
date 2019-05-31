import { NetworkGamepadAPIClass } from "./server/RemoteGamepadAPI";

const remoteGamepadAPI = NetworkGamepadAPIClass.getInstance();

// add remote gamepad api to global object...
let root: any = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};
root.remoteGamepadAPI = remoteGamepadAPI;

export { remoteGamepadAPI };