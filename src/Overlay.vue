<template lang="pug">
h2 super overlay
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Overlay extends Vue {

}
</script>

<style>

/* Show fullscreenButton on top */
#fullscreenButton {
    position: absolute;
    top: 5%;
    right: 5%;
    cursor: pointer;
}
</style>
