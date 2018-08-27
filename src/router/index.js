import Vue from 'vue'
import Router from 'vue-router'
import sellers from '@/components/sellers'
import ratings from '@/components/ratings'
import goods from '@/components/goods'


Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'goods',
      component: goods
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/sellers',
      component: sellers
    },
    {
      path: '/ratings',
      component: ratings
    },
  ]
})
