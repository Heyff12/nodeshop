<template>
  <div>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>test</span></h2>
      </div>
      <p v-once>不改变: {{ msg }}</p>
      <p>
        <button @click="change_msg">更改msg的值</button>
      </p>
      <p v-once>filters: {{ message | capitalize }}</p>
    </div>
    <div>
      <p>Original message: "{{ message }}"</p>
      <p>Computed reversed message: "{{ reversedMessage }}"</p>
    </div>
    <p>
      <button @click="change_message">更改message的值</button>
    </p>
    <div>{{ firstName }}{{ lastName }}========={{ fullName }}</div>
    <p>
      <button @click="change_fullName">更改fullName的值</button>
    </p>
    <div id="watch-example">
      <p>
        Ask a yes/no question:
        <input v-model="question">
      </p>
      <p>{{ answer }}</p>
    </div>
    <div>
      <input type="checkbox" id="checkbox" v-model="checked">
      <label for="checkbox">{{ checked }}</label>
    </div>
    <div>
      <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
      <label for="jack">Jack</label>
      <input type="checkbox" id="john" value="John" v-model="checkedNames">
      <label for="john">John</label>
      <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
      <label for="mike">Mike</label>
      <br>
      <span>Checked names: {{ checkedNames }}</span>
    </div>
    <div id="example-4">
      <input type="radio" id="one" value="One" v-model="picked">
      <label for="one">One</label>
      <br>
      <input type="radio" id="two" value="Two" v-model="picked">
      <label for="two">Two</label>
      <br>
      <span>Picked: {{ picked }}</span>
      <div id="example">全局
        <my-component></my-component>
      </div>
      <div id="example">局部
        <child></child>
      </div>
    </div>
    <div id="example-2">
      <simple-counter></simple-counter>
      <simple-counter></simple-counter>
      <simple-counter></simple-counter>
    </div>
    <child-msg message="hello!" v-bind:my-message="parentMsg"></child-msg>
    <p>
      <button @click="change_Parmsg">更改父组件parentMsg的值</button>
    </p>
    <div id="counter-event-example">
      <p>{{ total }}</p>
      <button-counter v-on:increment="incrementTotal"></button-counter>
      <button-counter v-on:increment="incrementTotal"></button-counter>
    </div>
    <toast :msg="msg"></toast>
    <div id="demo">
      <button v-on:click="show = !show">
        Toggle
      </button>
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
      <transition name="slide-fade">
        <p v-if="show">hello</p>
      </transition>
      <transition name="bounce">
    <p v-if="show">Look at me!</p>
  </transition>
    </div>
  </div>
</template>
<!-- <script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script> -->
<script>
// import axios from 'https://unpkg.com/axios@0.12.0/dist/axios.min.js'
// import _ from 'https://unpkg.com/lodash@4.13.1/lodash.min.js'
import toast from '../components/tips/toast'
var Child = {
  template: '<div>A custom component 局部!</div>'
}
export default {
  name: 'test',
  data() {
    return {
      msg: '第一次',
      message: 'first name haha',
      firstName: 'Foo',
      lastName: 'Bar',
      //fullName: 'Foo Bar',
      question: '',
      answer: 'I cannot give you an answer until you ask a question!',
      checkedNames: [],
      checked: true,
      picked: '',
      parentMsg: '父元素传入的数据',
      total: 0,
      show: true,
    }
  },
  components: {
    Child,
    toast
  },
  mounted() {

  },
  computed: {
    // a computed getter
    reversedMessage: function() {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('')
    },
    //简化
    // fullName: function () {
    //   return this.firstName + ' ' + this.lastName
    // },
    fullName: {
      //return this.firstName + ' ' + this.lastName
      // getter
      get() {
        console.log('get name');
        return this.firstName + ' ' + this.lastName;
      },
      // setter
      set(newValue) {
        console.log('set name');
        var names = newValue.split(' ');
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      }
    }
  },

  watch: {
    // firstName: function(val) {
    //   this.fullName = val + ' ' + this.lastName
    // },
    // lastName: function(val) {
    //   this.fullName = this.firstName + ' ' + val
    // },
    // 如果 question 发生改变，这个函数就会运行
    question: function(newQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      //this.getAnswer()
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  methods: {
    change_msg() {
      this.msg = "第二次赋值";
      console.log(this.msg);
    },
    change_message() {
      this.message = "sercond times";
    },
    change_fullName() {
      // this.firstName = "tim";
      // this.lastName = "lili";
      this.fullName = "lili tim";
    },
    change_Parmsg() {
      this.parentMsg = "sercond times  父组件的文字";
      console.log(this.parentMsg);
    },
    incrementTotal: function() {
      this.total += 1
    },
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问yesno.wtf/api的频率
    // ajax请求直到用户输入完毕才会发出
    // 学习更多关于 _.debounce function (and its cousin
    // _.throttle), 参考: https://lodash.com/docs#debounce
    // getAnswer: _.debounce(
    //   function() {
    //     if (this.question.indexOf('?') === -1) {
    //       this.answer = 'Questions usually contain a question mark. ;-)'
    //       return
    //     }
    //     this.answer = 'Thinking...'
    //     var vm = this
    //     axios.get('https://yesno.wtf/api')
    //       .then(function(response) {
    //         vm.answer = _.capitalize(response.data.answer)
    //       })
    //       .catch(function(error) {
    //         vm.answer = 'Error! Could not reach the API. ' + error
    //       })
    //   },
    //   // 这是我们为用户停止输入等待的毫秒数
    //   500
    // )
  }
}

</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in below version 2.1.8 */

{
  opacity: 0
}


/* 可以设置不同的进入和离开动画 */


/* 设置持续时间和动画函数 */

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */

{
  transform: translateX(10px);
  opacity: 0;
}
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
