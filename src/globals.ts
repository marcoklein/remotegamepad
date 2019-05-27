
/**
 * Written before real server connection code to avoid id clashing with peerjs.
 */
export const PRE_ID = 'uasfd87234huzweaf';

export type Message = {
    id?: number;
    reliable?: boolean;
    type: string;
    data?: any;
}

export const CONNECTION_PROPS = undefined;
/*export const CONNECTION_PROPS = {
    host: 'kleinprojects.com',
    port: 9000,
    path: '/'
}*/