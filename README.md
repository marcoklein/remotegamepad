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

# Three Main Components
The solution addresses three primary concerns:

1. The smartphone gamepad user interface
2. The connection through WebRTC
3. The server side API to use RemoteGamepad

The gamepad UI offers one standard layout but future releases might customize it. As WebRTC is still an emerging technology, there are browser to browser differences.
For the connection handling, the project leverages the power of [PeerJS](https://peerjs.com/), a JavaScript implementation of WebRTC. As you include the library into your project, it naturally maps around the native gamepad API. Thus, if you support gamepads already there is not further need for change.

## Gamepad User Interface
In the present, the user interface supports one standard layout with one analog pad on the left side, two action buttons on the right side, and a menu button in the center. Additionally, a button in the upper right corner switches to fullscreen mode.

For rendering, the front end uses a HTML5 canvas that always resizes to fill the full screen. A pad and button class provide the logic. They offer an easy way to enhance the interface.

## Connection Handling through WebRTC

## RemoteGamepad API