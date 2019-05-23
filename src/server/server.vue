<template lang="pug">
div
  b-container
    h1 Test Server of Smartphone Gamepad library
    b-button(variant='primary') Start

    b-list-group
      b-list-group-item Client A
      b-list-group-item Client B
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { SmartPadServer } from './SmartPadServer';

@Component
export default class TestServerApp extends Vue {
    server: SmartPadServer;
    mounted() {
        // initialize
        this.server = new SmartPadServer();
    }

}
</script>

<style>
</style>

