<template lang="pug">
div
  Overlay.overlay
  #images(style='display: none')
    // Loaded images for canvas
    img#padDarkImage(src='assets/padDark.png')
    img#padBackgroundDarkImage(src='assets/padBackgroundDark.png')
    img#buttonAImage(src='assets/buttonA.png')
  // canvas for rendering
  canvas#gamepadCanvas
</template>


<script lang="ts">
import Vue from 'vue'
import { Application } from './Application';
import Overlay from './Overlay.vue';
export default Vue.extend({
    components: {
        Overlay
    },
    mounted: () => {
        // initialize
        let canvas = <HTMLCanvasElement> document.getElementById('gamepadCanvas');
        // init application with canvas
        this.application = new Application(canvas);
    },
    data() {
        return {
            testString: 'hallo'
        }
    }
});
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
