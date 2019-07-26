import Vue from 'vue';
import App from './Main.vue';
import './client.scss';
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