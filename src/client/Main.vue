<template lang="pug">
div
  Overlay.overlay(v-bind:network='network')
  #images(style='display: none')
    // Loaded images for canvas
    img#padDarkImage(src='../assets/padDark.png')
    img#padBackgroundDarkImage(src='../assets/padBackgroundDark.png')
    img#buttonAImage(src='../assets/buttonA.png')
    
  // alerts
  b-alert(:show='dismissCountDown', dismissible='', variant='warning', @dismissed='dismissCountDown=0', @dismiss-count-down='countDownChanged')
    p {{ alertWarningMessage }}
    b-progress(variant='warning', :max='dismissSecs', :value='dismissCountDown', height='4px')
  // canvas for rendering
  canvas#gamepadCanvas


</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Application } from './Application';
import Overlay from './Overlay.vue';
import { SmartPadClient } from './SmartPadClient';


@Component({
    components: {
        Overlay
    }
})
export default class Main extends Vue {
    application: Application;

    network: SmartPadClient = null;
    dismissCountDown = 0;
    dismissSecs = 5;
    alertWarningMessage = '';

    mounted() {
        // initialize
        let canvas = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
        // init application with canvas
        this.application = new Application(canvas);

        this.application.network.connect('result').catch((reason) => {
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
b-alert {
    position: absolute;
    top: 0px;
    left: 0px;
}
</style>
