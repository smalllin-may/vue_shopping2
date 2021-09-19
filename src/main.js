import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
/* 引入字体图标css文件 */
import font from './assets/fonts/iconfont.css'
// Vue.use(axios)
/* 设置请求的根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //每次获取后台接口数据时需要验证，是否携带token  利用axios拦截器
axios.interceptors.request.use(config => {
    //利用Authorization验证token字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //最后必须加return config
    return config
})
Vue.prototype.$http = axios

/* 给全局vm加上axios */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')