// Environment configuration
if (process.env.NODE_ENV === 'production') {
  window.endpoint = 'https://shopty.herokuapp.com'
 } else {
  window.endpoint = 'http://localhost:3000'
 }
 // Global Variables
 window.moment = require('moment')
 window.axios = require('axios')
 window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import Product from './components/Product.vue'
import Order from './components/Order.vue'
import Complete from './components/Complete.vue'

Vue.use(VueRouter)

// Register routes
const routes = [
  { name: 'home', path: '/', component: Product },
  { name: 'order', path: '/order', component: Order },
  { name: 'order-complete', path: '/order-complete/:id', component: Complete }
 ]

 const router = new VueRouter({
  routes
 });

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
