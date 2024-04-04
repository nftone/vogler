import { createWebHistory, createRouter } from 'vue-router'

import Home from '../../Home.vue'
import AddressVerifier from '../../AddressVerifier.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/verifier', component: AddressVerifier }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
