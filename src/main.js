// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

//使用axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
//使用vue-lazyload--图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-bars.svg"
});
//滚动加载--分页
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
//filters
import { currency } from './util/currency'
Vue.filter('currency', currency);

//vuex
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    nickname: '',
    cartCount: 0
  },
  mutations: {
    updateUserinfo(state, nickname) {
      state.nickname = nickname;
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount;
    },
    initeCartCount(state, cartCount) {
      state.cartCount = cartCount;
    }
  }
});

// 注册--test页面用
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})
Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  // 技术上 data 的确是一个函数了，因此 Vue 不会警告，
  // 但是我们返回给每个组件的实例的却引用了同一个data对象
  data: function () {
    return { counter: 0 }
  }
})
Vue.component('child-msg', {
  // 声明 props
  props: ['message','myMessage'],
  // 就像 data 一样，prop 可以用在模板内
  // 同样也可以在 vm 实例中像“this.message”这样使用
  template: '<span>{{ message }}{{ myMessage }}</span>'
})
//子组件修改值
Vue.component('button-counter', {
  template: '<button v-on:click="incrementCounter">{{ counter }}</button>',
  data: function () {
    return {
      counter: 0
    }
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1
      this.$emit('increment')
    }
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
