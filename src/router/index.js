import Vue from 'vue'
import Router from 'vue-router'
import file from '@/components/file'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'file',
      component: file
    }
  ]
})
