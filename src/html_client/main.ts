

import $ from 'jquery';
import { RemoteGamepadClient } from '../network/client/RemoteGamepadClient';


let network: RemoteGamepadClient;

function init() {

    $('#connectButton').click(onConnectButtonClick);
}



/**
 * Button clicked to connect.
 */
function onConnectButtonClick() {
    let connectionCode = <string> $('#connectionCodeInput').val();
    console.log('Connecting with code: ', connectionCode);
    if (!connectionCode || connectionCode.trim() === '') {
        console.warn('Tried to connect with empty connection code.');
        return;
    }
    // change to connecting layout
    $('#inputConnectionCode').hide();
    $('#connecting').show();
    // connect
    if (!network) {
        network = new RemoteGamepadClient();
    }
    network.connect(connectionCode).then((client) => {
        console.log('Connection successfull.');
        // move to next scene
        $('#sceneConnectionCode').hide();
        $('#sceneGamepad').show();
    }).catch((error) => {
        console.error('Error on connection: ', error);
    }).finally(() => {
        // restore previous layout
        $('#inputConnectionCode').show();
        $('#connecting').hide();
    });
}














$(() => {
    init();
});