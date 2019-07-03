# Remote Gamepad
The Remote Gamepad project brings a Gamepad on the smartphone and communicates directly with the native gamepad API.
Thus, projects and games that are already supporting gamepads need only to include the project and show the connection code.
The system utilizes the WebRTC technology for direct client to client communication among browsers!

I created this project from a personal motivation, as there was no properly working solution out there.
As a broadcasting server would require additional hosting I decided to leverage WebRTC.
I'm happy to hear about your experiences with *RemoteGamepad*.

## Get Started
To try out the library follow these steps:

1. Include the library in your project
1. On start, the console prints a unique pairing code
1. Go to https://marcoklein.github.io/remotegamepad to access the mobile user interface
1. Input the pairing code
1. Play with the gamepad

# Usage
## Custom Remote Gamepad User Interface
Users access the remote gamepad on their smartphones. You may want to customize the layout and design of the gamepad.

First, install the project via:

```shell
npm install remotegamepad
```

Then import the client module:

```ts
import { RemoteGamepadClient } from 'remotegamepad/client';
```


# Architectural Design
The solution addresses three primary concerns:

1. The smartphone gamepad user interface
2. The connection through WebRTC
3. The server side API to use RemoteGamepad

The gamepad UI offers one standard layout but future releases might customize it. As WebRTC is still an emerging technology, there are browser to browser differences.
For the connection handling, the project leverages the power of [PeerJS](https://peerjs.com/), a JavaScript implementation of WebRTC. As you include the library into your project, it naturally maps around the native gamepad API. Thus, if you support gamepads already there is not further need for change.

## Gamepad User Interface
In the present, the user interface supports one standard layout with one analog pad on the left side, two action buttons on the right side, and a menu button in the center. Additionally, a button in the upper right corner switches to fullscreen mode.

For rendering, the front end uses a HTML5 canvas that always resizes to fill the full screen. A pad and button class provide the logic. They offer an easy way to enhance the interface.

### Connection States and Screens
The UI has three connection states:
1. Disconnected
    1. Enter Connection Code -> Connecting
2. Connecting
    1. Failure -> Disconnected
    1. Success -> Connected
3. Connected
    1. Lost Connection -> Disconnected

Each state switches the appropriate screen.

## Connection Handling through WebRTC
The project uses PeerJS for connection handling. The library provides a JavaScript implementation of the technology. Dedicated client and server classes handle the connection to fulfill special requirements of the gamepad application. In particular, client and server regularly send keep alive and ping messages. This is due to different browser implementations and some browser put a connection to sleep if the traffic is low.

## RemoteGamepad API
On the server-side, the RemoteGamepad API maps directly onto the native Gamepad API. Controlled gamepads have the property `remote` with the associated `RemoteGamepad` object. Additionally, the global object `RemoteGamepadAPI` provides direct access to further API elements.