<template lang="pug">
div#overlayContainer
  h4 {{ network.averagePing }}
  input#fullscreenButton.overlay(src='assets/buttonExpand.png', type='image', alt='Fullscreen', v-on:click="toogleFullscreen", v-if="fullscreenEnabled && !isFullscreen")
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import screenfull, { Screenfull } from 'screenfull';
import { SmartPadClient } from './SmartPadClient';
let fullscreenPlugin: Screenfull = <Screenfull> screenfull;


@Component({
    props: {
        network: Object
    }
})
export default class Overlay extends Vue {

    beforeCreate() {
        // change listener of fullscreen plugin
        fullscreenPlugin.on('change', () => {
            this.$data.isFullscreen = fullscreenPlugin.isFullscreen;
        });
    }

    mounted() {
    }

    /**
     * Use screenfull.js to toggle fullscreen if available.
     */
    toogleFullscreen() {
        fullscreenPlugin.toggle();
    }

    data() {
        return {
            fullscreenEnabled: fullscreenPlugin.enabled,
            isFullscreen: fullscreenPlugin.isFullscreen
        }
    }



}
</script>

<style>
#overlayContainer {
    width: 100%;
    height: 100%;
}
/* Show fullscreenButton on top */
#fullscreenButton {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
}
</style>
