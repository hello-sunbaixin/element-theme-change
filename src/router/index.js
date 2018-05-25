import Vue from 'vue'
import Router from 'vue-router'
import theme from '@/components/theme'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'theme',
      component: theme
    }
  ]
})
