import Peer, { DataConnection } from 'peerjs';

console.log('Creating new peer.');
let peer = new Peer('CATCHME2TFT');

peer.on('open', (id) => {
    console.log('Peer ready with id: ', id);
});

peer.on('connection', (conn) => {
    // measure ping continuously
    let pingStart: number;
    let measurePing = () => {
        console.log('send ping');
        pingStart = Date.now();
        conn.send('ping');
        setTimeout(() => {
            measurePing();
        }, 1000);
    }

    conn.on('data', (data) => {
        console.log('received data: ', data);
        if (data === 'pong') {
            // stop ping measure
            console.log('received pong');
            let ping = Date.now() - pingStart;
            console.log('ping: ' + ping);
            conn.send({t: 'ping', v: ping});
        } else if (data === 'ping') {
            conn.send('pong');
        }
    });
    console.log('Another peer connected!', conn.peer);
    console.log('Sending welcome messsage.');
    conn.send('Welcome');
    measurePing();
});