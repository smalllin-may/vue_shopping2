import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
// Vue.use(axios)
Vue.prototype.$http = axios
    /* 设置请求的根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    /* 给全局vm加上axios */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')