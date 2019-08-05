import Vue from 'vue'
import Router from 'vue-router'
import Ebook from '@/Ebook' // 导入组件

Vue.use(Router)

export default new Router({
  routes: [
    { // 根路径重定向
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      component: Ebook
    }
  ]
})
