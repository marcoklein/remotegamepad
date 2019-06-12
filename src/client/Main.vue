<template lang="pug">
div
  // overlay
  div#overlayContainer
    h4(v-if='network') {{ network.averagePing }}
    // fullscreen button
    button#fullscreenButton.overlay(type='button', alt='Fullscreen', v-on:click="toogleFullscreen", v-if="fullscreenEnabled && !isFullscreen")
        img(src='../assets/buttonExpand.png')
  
    // alerts
    div#alertContainer.overlay
      b-alert(:show='dismissCountDown', dismissible='', variant='warning', @dismissed='dismissCountDown=0', @dismiss-count-down='countDownChanged')
        p {{ alertWarningMessage }}
        b-progress(variant='warning', :max='dismissSecs', :value='dismissCountDown', height='4px')

  // images
  #images(style='display: none')
    // Loaded images for canvas
    img#padDarkImage(src='../assets/padDark.png')
    img#padBackgroundDarkImage(src='../assets/padBackgroundDark.png')
    img#buttonAImage(src='../assets/buttonA.png')
    img#buttonBImage(src='../assets/buttonB.png')
    img#buttonStartImage(src='../assets/buttonStart.png')
    img#buttonLeftImage(src='../assets/buttonLeft.png')
    img#buttonRightImage(src='../assets/buttonRight.png')
    
  // canvas for rendering
  canvas#gamepadCanvas


</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Application } from './Application';
import screenfull, { Screenfull } from 'screenfull';
import { RemoteGamepadClient } from '../network/client/RemoteGamepadClient';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


@Component
export default class Main extends Vue {
    application: Application;

    network: RemoteGamepadClient = null;
    dismissCountDown = 0;
    dismissSecs = 5;
    alertWarningMessage = '';
    fullscreenEnabled = fullscreenPlugin.enabled;
    isFullscreen = fullscreenPlugin.isFullscreen;

    beforeCreate() {
        // change listener of fullscreen plugin
        fullscreenPlugin.on('change', () => {
            this.$data.isFullscreen = fullscreenPlugin.isFullscreen;
        });
    }
    mounted() {
        // initialize
        let canvas = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
        // init application with canvas
        this.application = new Application(canvas);

        this.application.network.connect('catchme2').catch((reason) => {
            console.log('connect error', reason);
            this.showWarning('Connect Error: ' + reason);
        });
        this.application.network.events.on('peerError', (err) => {
            this.showWarning('Connect Error: ' + err);
        });
        this.application.network.events.on('connectionError', (err) => {
            this.showWarning('Connect Error: ' + err);
        });

        this.network = this.application.network;

    }

    showWarning(msg: string) {
        this.alertWarningMessage = msg;
        this.dismissCountDown = this.dismissSecs;
    }
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    }

    /**
     * Use screenfull.js to toggle fullscreen if available.
     */
    toogleFullscreen() {
        fullscreenPlugin.toggle();
    }
}
</script>

<style>
/* Scale canvas to fit windows */
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    border: 0;
    overflow: hidden;
    display: block;

    /* Enable floating fullscreenButton */
    position: relative;
}
.overlay {
    position: absolute;
}
#alertContainer {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
}
#overlayContainer {
    width: 100%;
    height: 100%;
    /* Click through container */
    pointer-events: none;
}
#overlayContainer > * {
    /* Default click behavior for childs. */
    pointer-events: initial;
}
/* Show fullscreenButton on top */
#fullscreenButton {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    background: transparent;
    border: 0;
}
</style>
