import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import GoodsList from '../views/GoodsList.vue'
import cart from '../views/cart.vue'
import address from '../views/address.vue'
import orderConfirm from '../views/orderConfirm.vue'
import orderSuc from '../views/orderSuc.vue'
import test from '../views/test.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    },
    {
      path: '/orderSuc',
      name: 'orderSuc',
      component: orderSuc
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
