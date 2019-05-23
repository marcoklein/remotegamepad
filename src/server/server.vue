<template lang="pug">
div
  h1 Test Server of Smartphone Gamepad library
  button.btn.btn-primary(type='button') Start
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

