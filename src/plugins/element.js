import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input, Message)
    /* 将Message挂载在vm组件上 */
Vue.prototype.$Message = Message;