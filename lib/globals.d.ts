/**
 * Written before real server connection code to avoid id clashing with peerjs.
 */
export declare const PRE_ID = "uasfd87234huzweaf";
export declare type Message = {
    id?: number;
    reliable?: boolean;
    type: string;
    data?: any;
};
export declare const CONNECTION_PROPS: any;
