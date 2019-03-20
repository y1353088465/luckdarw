import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

import Home from '../views/Home.vue'
import successfulAnswer from '../views/successfulAnswer.vue'
import luck_draw from '../views/luck_draw.vue'
import no_prize from '../views/no_prize.vue'
import winning_the_prize from '../views/winning_the_prize.vue'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/successfulAnswer',
        name: 'successfulAnswer',
      component: successfulAnswer
    },
    {
      path: '/luck_draw',
      name: 'luck_draw',
      component: luck_draw
    },
    {
      path: '/no_prize',
      name: 'no_prize',
      component: no_prize
    },
    {
      path: '/winning_the_prize',
      name: 'winning_the_prize',
      component: winning_the_prize
    },
    /*按需加载路由写入方式------------------------------------------------------------------------*/
    // {
    //   path: '/successfulAnswer',
    //   name: 'successfulAnswer',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/successfulAnswer.vue')
    // }
  ]
})
