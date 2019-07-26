import Vue from 'vue';
import App from './server.vue';
import './server.scss';
import BootstrapVue from 'bootstrap-vue'

// use bootstrap vue
Vue.use(BootstrapVue)
/**
 * Entry for Vue application.
 */
new Vue({
    el: '#app',
    render: h => h(App)
});
