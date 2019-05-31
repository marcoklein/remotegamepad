import { NetworkGamepadAPIClass } from "./server/RemoteGamepadAPI";

const RemoteGamepadAPI = NetworkGamepadAPIClass.getInstance();

// add remote gamepad api to global object...
let root: any = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};
root.RemoteGamepadAPI = RemoteGamepadAPI;

export { RemoteGamepadAPI };