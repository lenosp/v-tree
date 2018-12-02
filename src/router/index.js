import Vue from 'vue'
import Router from 'vue-router'
import vTree from '@/components/vTreeDemo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vTree',
      component: vTree
    }
  ]
})
