<template lang="pug">
div
  b-container
    h3 Test Server of Smartphone Gamepad library
    div Connection Code: {{ connectionCode }}

    hr
    h3 Clients
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
        this.server.start().then((id) => {
            console.log('server opened with id ', id);
            this.$data.connectionCode = this.server.connectionCode;
        });
    }

    data() {
        return {
            connectionCode: '... connecting ...'
        };
    }

    

}
</script>

<style>
</style>

