<template lang="pug">
div
  b-container
    h3 Test Server of Smartphone Gamepad library
    div Connection Code: {{ connectionCode }}

    hr
    h3 Clients
    b-list-group
      b-list-group-item(v-for='item in clients')
        | {{ item.id }}
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
            // provide connection code and clients to front end
            this.$data.connectionCode = this.server.connectionCode;
            this.$data.clients = this.server.clients;
        });
    }

    data() {
        return {
            connectionCode: '... connecting ...',
            clients: []
        };
    }


    

}
</script>

<style>
</style>

