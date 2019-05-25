<template lang="pug">
div
  Overlay.overlay(v-bind:network='network')
  #images(style='display: none')
    // Loaded images for canvas
    img#padDarkImage(src='assets/padDark.png')
    img#padBackgroundDarkImage(src='assets/padBackgroundDark.png')
    img#buttonAImage(src='assets/buttonA.png')
  // canvas for rendering
  canvas#gamepadCanvas
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Application } from './Application';
import Overlay from './Overlay.vue';


@Component({
    components: {
        Overlay
    }
})
export default class Main extends Vue {
    application: Application;

    mounted() {
        // initialize
        let canvas = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
        // init application with canvas
        this.application = new Application(canvas);
        this.$data.network = this.application.network;
    }

    data() {
        return {
            testString: 'hallo',
            network: {
                averagePing: -1
            }
        }
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
</style>
