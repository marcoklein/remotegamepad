import Vue from 'vue';
import App from './server.vue';
import './server.scss';

/**
 * Entry for Vue application.
 */
new Vue({
    el: '#app',
    render: h => h(App)
});
