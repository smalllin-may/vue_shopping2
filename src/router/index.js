import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: login },
            {
                path: '/home',
                component: home,
                /* 进入home页面自动跳转到welcome路由组件 */
                redirect: "/welcome",
                children: [
                    { path: '/welcome', component: welcome },
                    { path: '/users', component: users },
                ]
            }
        ]
    })
    /* 设置前置路由守卫来判断浏览器是否处于登录状态，利用token */
router.beforeEach((to, from, next) => {
    //to 将要访问的路劲
    //from 要跳转的路劲
    //next 是一个函数next():放行 next('/login')强制跳转
    if (to.path == '/login') return next()
        /* 如果token不存在，则重定向到设置的页面 */
    let sessionstorage = window.sessionStorage.getItem("token")
    if (!sessionstorage) return next('/login')
    next();
})
export default router