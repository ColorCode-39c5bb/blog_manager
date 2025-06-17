import Vue from 'vue';
import VueRouter from "vue-router";
import EventConfigPlugin from './plugins/event_plugin';

import App from './App.vue';
import router from "./configs/index.js"
import event_config from './configs/event_config.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(EventConfigPlugin);

const vue = 
new Vue({
    render: h => h(App),
    event_config: event_config, 
    router: router,
    beforeCreate(){
        Vue.prototype.$bus = this;
    }
});
vue.$mount('#app');

console.log(vue);
export default vue;
