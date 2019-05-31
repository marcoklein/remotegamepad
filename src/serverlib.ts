import { NetworkGamepadAPIClass } from "./server/RemoteGamepadAPI";


// add remote gamepad api to global object...
let root: any = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

// use existing remote gamepad api or load new instance
const remoteGamepadAPI = root.remoteGamepadAPI || NetworkGamepadAPIClass.getInstance();
root.remoteGamepadAPI = remoteGamepadAPI;

export { remoteGamepadAPI };